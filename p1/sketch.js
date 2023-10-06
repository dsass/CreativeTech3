let handpose;
let video;
let hands = [];
let sploot = null;
let closed = false;
let splats=[];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("hand", results => {
    hands = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();
  // frameRate(20);
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  background(60)
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();

  for (let i = 0; i < splats.length; i++) {
    splats[i].drawSplat();
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // console.log(hands.length);
  // if(hands.length > 0) {
  //   noLoop();
  // }
  for (let i = 0; i < hands.length; i += 1) {
    const hand = hands[i];
    // for (let j = 0; j < hand.landmarks.length; j += 1) {
    //   const keypoint = hand.landmarks[j];
    //   fill(0, 255, 0);
    //   noStroke();
    //   ellipse(keypoint[0], keypoint[1], 10, 10);
    // }
    let pinky = hand.annotations.pinky[0];
    let pinky1 = hand.annotations.pinky[2];
    let index = hand.annotations.indexFinger[0];
    let index1 = hand.annotations.indexFinger[1];
    let index2 = hand.annotations.indexFinger[2];
    let base = hand.annotations.palmBase[0];

    fill(255,220,100);
    // ellipse(pinky[0], pinky[1], 10,10);
    // ellipse(index[0], index[1], 10,10);
    // ellipse(base[0], base[1], 10,10);
    let mid = [(pinky[0]+index[0]+base[0])/3, (pinky[1]+index[1]+base[1])/3];

    let size = dist(pinky[0],pinky[1],index[0],index[1])

    let d1 = dist(index1[0],index1[1],base[0],base[1]);
    let d2 = dist(index2[0], index2[1],base[0],base[1]);
    if(d1 >= d2) {
      if(closed == false) {
        sploot = null;
      }
      closed = true;
      // fill(255,0,255);

      if(sploot == null) {
        sploot = new Splat(mid[0],mid[1], size*0.4);
        splats.push(sploot);
      }
      // sploot.drawSplat();
    } else {
      closed = false;
      textSize(size);
      text("🍅", mid[0]-size/2, mid[1]+size/2);

      // ellipse(mid[0], mid[1], dist(pinky[0],pinky[1],index[0],index[1]));
    }

  }
}

class Splat {
  constructor(x, y, d) {
    this.verts = []; // actual drawn vertices
    this.verts2 = []; // original locations
    this.x = x;
    this.y = y;
    this.d = d;
    this.color = color(255, random(50,90), random(0,40));
    // this.color = random(colors);

    let a = 100;
    let b = 100;
    let t = 0;
    for (let i = 0; i < 63; i++) {
      a = -sin(t) * d + random(-2,2);
      b = -cos(t) * d + random(-2,2);
      t += 0.1;
      this.verts.push([a, b]);
      this.verts2.push([a+x, b+y]);


    }
    this.verts.push(this.verts[0]);
    this.verts2.push(this.verts2[0]);

  }

  drawSplat() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(this.color);
    beginShape();
    let t = 0

    let first = 0;
    vertex(this.verts[0][0], this.verts[0][1]);
    for (let i = 0; i < this.verts.length; i++) {
      let y_scalar = map(this.verts2[i][1]-this.y, -100, 100, 0.1, 0.5);
      if(this.verts2[i][1]-this.y < 5) {
        y_scalar = 0;
      }
      // console.log(this.verts[i][1]);
      // this.turnOnPoints(i);


      curveVertex(this.verts[i][0], this.verts[i][1]);
      if (i != 0) {

        this.verts[i][1] += noise(this.verts2[i][0], this.verts2[i][1]) * y_scalar;
        // this.verts[i][0]+=(noise(t-1)-0.5)*0.3;
        // this.verts[i][0] += (noise(this.verts2[i][0], this.verts2[i][1]) - 0.5) * y_scalar*0.1;
        // console.log((noise(this.verts2[i][0], this.verts2[i][1]) - 0.5) * y_scalar*0.3);

      }

      t += 0.1
    }

    vertex(this.verts[this.verts.length - 1][0], this.verts[this.verts.length - 1][1]);
    endShape();
    pop();
  }

  turnOnPoints(i) {
      if (i == this.verts.length - 1) {
        stroke(255, 0, 0);
      } else {
        stroke(0);
      }
      ellipse(this.verts[i][0], this.verts[i][1], 3,3);
      stroke(0);
      noStroke();
  }
}

// Daniel Shiffman
// http://youtube.com/thecodingtrain
// http://codingtra.in

// KNN Classification with Feature Extractor
// 1: https://youtu.be/KTNqXwkLuM4 
// 2: https://youtu.be/Mwo5_bUVhlA 
// 3: https://youtu.be/JWsKay58Z2g 


let video;
let features;
let knn;
let labelP;
let ready = false;
let label = 'nothing';
let speed = 3;
let ex= 170;

let x=20;
let y=20;
let dx=1;
let dy=1;

function setup() {
  createCanvas(320, 240);
  video = createCapture(VIDEO);
  video.size(320, 240); 
 // video.hide();
  features = ml5.featureExtractor('MobileNet', modelReady);
  knn = ml5.KNNClassifier();
  labelP = createP('need training data');
  labelP.style('font-size', '32pt');
  x = width / 2;
  y = height / 2;
}

function goClassify() {
  const logits = features.infer(video);
  knn.classify(logits, function(error, result) {
    if (error) {
      console.error(error);
    } else {
      label = result.label;
      labelP.html(result.label);
      goClassify();
    }
  });
}

function keyPressed() {
  const logits = features.infer(video);
  if (key == 'l') {
    knn.addExample(logits, 'left');
    console.log('left');
  } else if (key == 'r') {
    knn.addExample(logits, 'right');
    console.log('right');
  } else if (key == 'u') {
    knn.addExample(logits, 'up');
    console.log('up');
  } else if (key == 'd') {
    knn.addExample(logits, 'down');
    console.log('down');
  } else if (key == 's') {
    //save(knn, 'model.json');
    knn.save('model.json');
  }
}

function modelReady() {
  console.log('model ready!');
  // Comment back in to load your own model!
  // knn.load('model.json', function() {
  //   console.log('knn loaded');
  // });
}

function draw() {
 background(150);
	noFill();
	stroke(255);
  strokeWeight(10);
  ellipse(ex, height-50,50,1);
  strokeWeight(1);
	ellipse(x,y,40,40);
	x=x+dx;
	y=y+dy;
	
	if(x<20||x>width-20){
	  dx=-dx;
	}
	if(y<20||(x>ex-30 & x<ex+30 & y==height-70)){
	  dy=-dy;
	}
	if((x<=ex-30 & y<=height-50 & dist(x,y,ex-30,height-50)     <=20)||(x>=ex+30 & y<=height-50 &  
		dist(x,y,ex+30,height-50)<=20)){
	  dx=-dx;
		dy=-dy;
	}
	if(y>height+25){
      x=random(20,width-20);
      y=20;
      dx=1;
      dy=1; 
      console.log("you lost");
	}  

  if (label == 'left') {
    ex = ex - 3;
  } else if (label == 'right') {
    ex = ex + 3;
  } else if (label == 'up') {
    y--;
  } else if (label == 'down') {
    y++;
  }

  //image(video, 0, 0);
  if (!ready && knn.getNumLabels() > 0) {
    goClassify();
    ready = true;
  }
}

// Temporary save code until ml5 version 0.2.2
// const save = (knn, name) => {
  // const dataset = knn.knnClassifier.getClassifierDataset();
  // if (knn.mapStringToIndex.length > 0) {
    // Object.keys(dataset).forEach(key => {
      // if (knn.mapStringToIndex[key]) {
        // dataset[key].label = knn.mapStringToIndex[key];
      // }
    // });
  // }
  // const tensors = Object.keys(dataset).map(key => {
    // const t = dataset[key];
    // if (t) {
      // return t.dataSync();
    // }
    // return null;
  // });
  // let fileName = 'myKNN.json';
  // if (name) {
    // fileName = name.endsWith('.json') ? name : `${name}.json`;
  // }
  // saveFile(fileName, JSON.stringify({ dataset, tensors }));
// };

const saveFile = (name, data) => {
  const downloadElt = document.createElement('a');
  const blob = new Blob([data], { type: 'octet/stream' });
  const url = URL.createObjectURL(blob);
  downloadElt.setAttribute('href', url);
  downloadElt.setAttribute('download', name);
  downloadElt.style.display = 'none';
  document.body.appendChild(downloadElt);
  downloadElt.click();
  document.body.removeChild(downloadElt);
  URL.revokeObjectURL(url);
};
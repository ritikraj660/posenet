let video;
let poseNet;
let poses = [];

function setup() {
  const canvas = createCanvas(640, 480);
  canvas.parent('videoContainer');

  // Video capture
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  
  // Hide the video element, and just show the canvas
  video.hide();
}

function draw() {
  image(video, 0, 0, width, height);
 
  // We can call both functions to draw all keypoints and the skeletons
 
	//stroke(0, 255, 0);
	//text ('Please take a step back so that we can see your entire pose',10,10);
	drawKeypoints();
    drawSkeleton(); 

  
  
}


function modelReady(){
  select('#status').html('model Loaded')
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  
{
  // Loop through all the poses detected
  
  for (let i = 0; i < poses.length; i++) 
  {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
	if (pose.keypoints[16].score < 0.2 | pose.keypoints[15].score < 0.2) 
    {
        textSize(20);
		stroke(0, 255, 0);
	    text ('Please take a step back so that we can see your entire pose',10,20);
		
	}else
	{
	let y1 = pose.keypoints[1].position.y;
	let y2 = pose.keypoints[16].position.y;
	let r = 0.47*(y2-y1);
	textSize(20);
	stroke(0, 255, 0);
	text (r+'c.m.',10,20);
	}
		
	for (let j = 0; j < pose.keypoints.length; j++) 
	{
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
		let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
		if (keypoint.score > 0.2) 
		{
         fill(255, 0, 0);
         noStroke();
         ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        }
     }
	
  }
	
}
  

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected

 
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
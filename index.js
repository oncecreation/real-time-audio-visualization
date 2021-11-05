import circleRenderer from './sphereRender.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')


// ----------------------------------------------------------
// Buttons 
const playButton = document.getElementById('button-play')
const pauseButton = document.getElementById('button-pause')

playButton.addEventListener('click', async (e) => {
	await init()
    await setTurnSpeed(2 * Math.PI / 1600)
    await startAudio()
})

pauseButton.addEventListener('click', async (e) => {
	await audio.pause()
    await setTurnSpeed(0)
    await setTurnAngle(0)
})


// --------------------------------------------------------
// Audio setup

// Defime some variables 
let analyser
let frequencyArray
let audio

// Starts playing the audio
function startAudio() {
	// make a new Audio Object
	audio = new Audio()
	// Get a context 
	const audioContext = new (window.AudioContext || window.webkitAudioContext)()

    audio.src = 'gold_dust.mp3'
    // audio.src = 'road_runner.mp3'

	// Make a new analyser
	analyser = audioContext.createAnalyser()
	// Connect the analyser and the audio
	const source = audioContext.createMediaElementSource(audio)
	source.connect(analyser)
	analyser.connect(audioContext.destination)

	// Get an array of audio data from the analyser
	frequencyArray = new Uint8Array(analyser.frequencyBinCount)
	// console.log(frequencyArray.length)
	
	// Start playing the audio
	audio.play()

	requestAnimationFrame(render)
}

// --------------------------------------------------------
// Initialize sphere
const centerX = 900 / 2
const centerY = 520 / 2
const radius = 900 / 4


var displayWidth;
var displayHeight;
var particleList;
var recycleBin;
var particleAlpha;
var r,g,b;
var fLen;
var m;
var projCenterX;
var projCenterY;
var zMax;
var sphereRad, sphereCenterX = centerX, sphereCenterY = centerY, sphereCenterZ;
var particleRad;
var zeroAlphaDepth;
var randAccelX, randAccelY, randAccelZ;
var gravity;
var rgbString;
var p;
var i;
var theta, phi;
var x0, y0, z0;

r = 255;
g = 0;
b = 0;

rgbString = "rgba("+r+","+g+","+b+","; //partial string for color which will be completed by appending alpha value.
particleAlpha = 1; //maximum alpha

displayWidth = canvas.width;
displayHeight = canvas.height;

fLen = 320; //represents the distance from the viewer to z=0 depth.

//projection center coordinates sets location of origin
projCenterX = displayWidth/2;
projCenterY = displayHeight/2;

//we will not draw coordinates if they have too large of a z-coordinate (which means they are very close to the observer).
zMax = fLen-2;

particleList = {};
recycleBin = {};

//random acceleration factors - causes some random motion
randAccelX = 0;
randAccelY = 0;
randAccelZ = 0;

gravity = 0; //try changing to a positive number (not too large, for example 0.3), or negative for floating upwards.

particleRad = 2.5;
sphereRad = radius;// * (Math.max(...frequencyArray) / 240);
sphereCenterX = 0;
sphereCenterY = 0;
sphereCenterZ = -3 - sphereRad;

//alpha values will lessen as particles move further back, causing depth-based darkening:
zeroAlphaDepth = -750; 

let turnAngle = 0; //initial angle
let turnSpeed = 2 * Math.PI / 1600; //the sphere will rotate at this speed (one complete rotation every 1600 frames).

function setTurnAngle(x) {
    turnAngle = x
}

function setTurnSpeed(x) {
    turnSpeed = x
}


init()
// ctx.fillStyle = "#0b0b0b";
// ctx.fillRect(0, 0, displayWidth, displayHeight);

function init() {

    for (i = 0; i < 1024; i++) {
        theta = Math.random()*2*Math.PI;
        phi = Math.acos(Math.random()*2-1);
        x0 = sphereRad * Math.sin(phi) * Math.cos(theta);
        y0 = sphereRad * Math.sin(phi) * Math.sin(theta);
        z0 = sphereRad * Math.cos(phi);
        
        //We use the addParticle function to add a new particle. The parameters set the position and velocity components.
        //Note that the velocity parameters will cause the particle to initially fly outwards away from the sphere center (after
        //it becomes unstuck).
        p = addParticle(x0, sphereCenterY + y0, sphereCenterZ + z0, 0.002*x0, 0.002*y0, 0.002*z0);
        //we set some "envelope" parameters which will control the evolving alpha of the particles.
        p.attack = 50;
        p.hold = 50;
        p.decay = 60;
        p.initValue = 0;
        p.holdValue = particleAlpha;
        p.lastValue = 0;
        p.age = 1 / 50;
        //the particle will be stuck in one place until this time has elapsed:
        p.stuckTime = 80 + Math.random()*20;
        
        p.accelX = 0;
        p.accelY = gravity;
        p.accelZ = 0;
    }

    function addParticle(x0,y0,z0,vx0,vy0,vz0) {
        var newParticle;
        var color;
        
        //check recycle bin for available drop:
        if (recycleBin.first != null) {
            newParticle = recycleBin.first;
            //remove from bin
            if (newParticle.next != null) {
                recycleBin.first = newParticle.next;
                newParticle.next.prev = null;
            }
            else {
                recycleBin.first = null;
            }
        }
        //if the recycle bin is empty, create a new particle (a new ampty object):
        else {
            newParticle = {};
        }
        
        //add to beginning of particle list
        if (particleList.first == null) {
            particleList.first = newParticle;
            newParticle.prev = null;
            newParticle.next = null;
        }
        else {
            newParticle.next = particleList.first;
            particleList.first.prev = newParticle;
            particleList.first = newParticle;
            newParticle.prev = null;
        }
        
        //initialize
        newParticle.x = x0;
        newParticle.y = y0;
        newParticle.z = z0;
        newParticle.velX = vx0;
        newParticle.velY = vy0;
        newParticle.velZ = vz0;
        newParticle.age = 0;
        newParticle.dead = false;
        if (Math.random() < 0.5) {
            newParticle.right = true;
        }
        else {
            newParticle.right = false;
        }
        return newParticle;		
    }
}

// --------------------------------------------------------
// Render particles
function render() {

	analyser.getByteFrequencyData(frequencyArray)
	
	// Use one of the renderers below 
    // const radiusOffset = sphereRad * Math.max(...frequencyArray) / 240
	circleRenderer(
        ctx, 
        displayWidth,
        displayHeight,
        particleList,
        fLen,
        m,
        projCenterX,
        projCenterY,
        sphereCenterZ,
        particleRad,
        zeroAlphaDepth,
        rgbString,
        turnAngle,
        setTurnAngle,
        turnSpeed,
        // radiusOffset
        frequencyArray
    )
    // console.log(frequencyArray)
	// Set up the next animation frame
	setTimeout(() => requestAnimationFrame(render), 20)
}
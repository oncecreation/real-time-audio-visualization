import circleRenderer from './sphereRender.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// ----------------------------------------------------------
// Buttons 
// const playButton = document.getElementById('button-play')
// const pauseButton = document.getElementById('button-pause')

// playButton.addEventListener('click', async (e) => {
// 	await init()
//     await setTurnSpeed(2 * Math.PI / 1600)
//     await startAudio()
// })

// pauseButton.addEventListener('click', async (e) => {
// 	await audio.pause()
//     await setTurnSpeed(0)
//     await setTurnAngle(0)
// })


// --------------------------------------------------------
// Audio setup

// Defime some variables 
let analyser
let frequencyArray
let audioElement

function changeHandler({
    target
  }) {
    // Make sure we have files to use
    if (!target.files.length) return;
  
    // Create a blob that we can use as an src for our audio element
    const urlObj = URL.createObjectURL(target.files[0]);
  
    // Create an audio element
    audioElement = document.createElement("audio");
  
    // Clean up the URL Object after we are done with it
    audioElement.addEventListener("load", () => {
      URL.revokeObjectURL(urlObj);
    });
  
    // Append the audio element
    document.body.appendChild(audioElement);
  
    // Allow us to control the audio
    audioElement.controls = "true";
  
    // Set the src and start loading the audio from the file
    audioElement.src = urlObj;
    startAudio()
  }
  
  document
    .getElementById("audio-file")
    .addEventListener("change", changeHandler);

// Starts playing the audio
function startAudio() {
	// make a new Audio Object
	// audio = new Audio()
	// Get a context 
	const audioContext = new (window.AudioContext || window.webkitAudioContext)()

    // audio.src = 'batuque.mp3'
    // let audioElement = document.getElementById("audio-file");
    // audioElement.src = audioElement.value

	// Make a new analyser
	analyser = audioContext.createAnalyser()
	// Connect the analyser and the audio
	const source = audioContext.createMediaElementSource(audioElement)
	source.connect(analyser)
	analyser.connect(audioContext.destination)

	// Get an array of audio data from the analyser
	frequencyArray = new Uint8Array(analyser.frequencyBinCount)

	// Start playing the audio
	audioElement.play()

	requestAnimationFrame(render)
}

// --------------------------------------------------------
// Initialize sphere

const displayWidth = canvas.width,
    displayHeight = canvas.height,
    particleList = {},
    fLen = 320,
    projCenterX = displayWidth / 2,
    projCenterY = displayHeight / 2,
    sphereRad = 900 / 3, 
    sphereCenterY = 0, 
    sphereCenterZ = -3 - sphereRad,
    particleRad = 3

let turnAngle = 0,
    turnSpeed = 2 * Math.PI / 1600,
    m,
    p,
    i,
    theta, 
    phi,
    x0, 
    y0, 
    z0

function setTurnAngle(x) {
    turnAngle = x
}

function setTurnSpeed(x) {
    turnSpeed = x
}


init()

function init() {

    for (i = 0; i < 1024; i++) {
        theta = Math.random() * 2 * Math.PI;
        phi = Math.acos(Math.random() * 2 - 1);
        x0 = Math.sin(phi) * Math.cos(theta);
        y0 = Math.sin(phi) * Math.sin(theta);
        z0 = Math.cos(phi);

        p = addParticle(x0, sphereCenterY + y0, z0);        
    }

    function addParticle(x0,y0,z0) {
        var newParticle = {};
        
        if (particleList.first == null) {
            particleList.first = newParticle;
            newParticle.prev = null;
            newParticle.next = null;
        } else {
            newParticle.next = particleList.first;
            particleList.first.prev = newParticle;
            particleList.first = newParticle;
            newParticle.prev = null;
        }
        
        newParticle.xInitial = x0;
        newParticle.yInitial = y0;
        newParticle.zInitial = z0;
        newParticle.x = x0;
        newParticle.y = y0;
        newParticle.z = z0;

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
        turnAngle,
        setTurnAngle,
        turnSpeed,
        frequencyArray,
        sphereRad
    )
 
    requestAnimationFrame(render)
}
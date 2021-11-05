import circleRenderer from './sphere.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')


// ----------------------------------------------------------
// Buttons 
const playButton = document.getElementById('button-play')
const pauseButton = document.getElementById('button-pause')

playButton.addEventListener('click', (e) => {
	startAudio()
})

pauseButton.addEventListener('click', (e) => {
	audio.pause()
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

// This function renders the audio to the canvas using a renderer
function render() {

	analyser.getByteFrequencyData(frequencyArray)
	
	// Use one of the renderers below 

    const centerX = 900 / 2
	const centerY = 520 / 2
	const radius = 900 / 4

	circleRenderer(ctx, frequencyArray, centerX, centerY, radius)
    // console.log(frequencyArray)
	// Set up the next animation frame
	setTimeout(() => requestAnimationFrame(render), 10)
}
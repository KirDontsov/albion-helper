import '@tensorflow/tfjs-node';
import cocoSsd from '@tensorflow-models/coco-ssd';
import jpeg from "jpeg-js";
import fs from "fs";

const imgJpgPaths = [
	"./assets/cotton-one.jpg",
	"./assets/cotton-two.jpg",
	"./assets/cotton-three.jpg",
	"./assets/cotton-four.jpg",
	"./assets/cotton-five.jpg",
];

(async () => {
	// const img = document.getElementById('img');
	let plantImg = jpeg.decode(fs.readFileSync(imgJpgPaths[0]));
	// Load the model.
	const model = await cocoSsd.load();

	// Classify the image.
	const predictions = await model.detect({width: plantImg.width, height: plantImg.height, data: plantImg.data});

	console.log('Predictions: ');
	console.log(predictions);
})();
import robot from 'robotjs';
import cv from 'opencv.js';
import fs from 'fs';
import pngToJpeg from 'png-to-jpeg';
import jpeg from 'jpeg-js';
import { sleep } from '../../utils/index.js';

/** Конвертация png в jpeg */
function convertPngToJpeg() {
	/** CONFIG */
	const imgPngPath = "./assets/cotton-flover.png";
	const imgJpgPath = "./assets/cotton-flover.jpeg";

	pngToJpeg({quality: 90})(fs.readFileSync(imgPngPath))
		.then((output) => fs.writeFileSync(imgJpgPath, output));
}
// convertPngToJpeg();

/**
 * Нажимает кнопку логина на 1 экране
 */
function collect() {
	/** CONFIG */
	const imgJpgPaths = [
		"./assets/cotton-one.jpg",
		"./assets/cotton-two.jpg",
		"./assets/cotton-three.jpg",
		"./assets/cotton-four.jpg",
		"./assets/cotton-five.jpg",
	];

	console.log('start collect');
	sleep(2000);

	// const plantImgOne = jpeg.decode(fs.readFileSync(imgJpgPathOne));
	// const plantImgTwo = jpeg.decode(fs.readFileSync(imgJpgPathTwo));

	let loops_count = 0;

	while(loops_count < 500) {
		let plantImg = jpeg.decode(fs.readFileSync(imgJpgPaths[loops_count]));
		const screen = robot.screen.capture();
		const screenBuffer = {
			width: screen.width,
			height: screen.height,
			exifBuffer: undefined,
			data: screen.image,
		};

		if (plantImg !== null) {
			let src = cv.matFromImageData(screenBuffer);
			let templOne = cv.matFromImageData(plantImg);
			// let templTwo = cv.matFromImageData(plantImg);

			let dst = new cv.Mat();
			let mask = new cv.Mat();
			cv.matchTemplate(src, templOne, dst, cv.TM_CCOEFF, mask);
			console.log('dst', dst);
			console.log('src', src);
			let result = cv.minMaxLoc(dst, mask);
			console.log('result', result);
			let maxPoint = result.maxLoc;
			let point = new cv.Point(maxPoint.x + templOne.cols, maxPoint.y + templOne.rows);
			// Находим середину объекта
			const leftTopEdge = { x: (point.x - templOne.cols) / 2, y: (point.y -  templOne.rows) / 2 };
			robot.moveMouseSmooth(leftTopEdge.x + plantImg.width / 4, leftTopEdge.y + plantImg.width / 4);
			sleep(1000);
			robot.mouseClick();
			sleep(1000 * 6);
			robot.keyTap('a');
			sleep(1000 * 5);
			let color = new cv.Scalar(255, 0, 0, 255);
			cv.rectangle(src, maxPoint, point, color, 2, cv.LINE_8, 0);
			fs.writeFileSync("./assets/cotton-output.jpeg", jpeg.encode({
				data: src.data,
				width: src.size().width,
				height: src.size().height
			}, 50).data);
			src.delete(); dst.delete(); mask.delete();
		}
		if (loops_count === imgJpgPaths.length - 1) {
			loops_count = 0;
		} else {
			loops_count = loops_count += 1;
		}
	}
	console.log('finish collect');
}

collect();


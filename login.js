import robot from 'robotjs';
import cv from 'opencv.js';
import fs from 'fs';
import pngToJpeg from 'png-to-jpeg';
import jpeg from 'jpeg-js';
import { sleep } from './utils/index.js';

/** Конвертация png в jpeg */
function convertPngToJpeg() {
	/** CONFIG */
	const imgPngPath = "./tree.png";
	const imgJpgPath = "./tree.jpeg";

	pngToJpeg({quality: 90})(fs.readFileSync(imgPngPath))
		.then((output) => fs.writeFileSync(imgJpgPath, output));
}
// convertPngToJpeg();

/**
 * Нажимает кнопку логина на 1 экране
 */
function login() {
	/** CONFIG */
	const imgJpgPath = "./login_btn.jpeg";

	console.log('start login one');
	sleep(2000);

	const loginBtn = jpeg.decode(fs.readFileSync(imgJpgPath));
	const screen = robot.screen.capture();

	const screenBuffer = {
		width: screen.width,
		height: screen.height,
		exifBuffer: undefined,
		data: screen.image,
	};

	try {
		if (loginBtn !== null) {
			let src = cv.matFromImageData(screenBuffer);
			let templ = cv.matFromImageData(loginBtn);


			let dst = new cv.Mat();
			let mask = new cv.Mat();
			cv.matchTemplate(src, templ, dst, cv.TM_CCOEFF_NORMED, mask);
			let color = new cv.Scalar(255, 0, 0, 255);
			let result = cv.minMaxLoc(dst, mask);
			let maxPoint = result.maxLoc;
			let point = new cv.Point(maxPoint.x + templ.cols, maxPoint.y + templ.rows);
			cv.rectangle(src, maxPoint, point, color, 2, cv.LINE_8, 0);
			// Находим середину объекта
			const leftTopEdge = { x: (point.x - templ.cols) / 2, y: (point.y -  templ.rows) / 2 };
			console.log('result', result);

			if (result.minVal < 0 && result.maxVal > 0) {
				robot.moveMouseSmooth(leftTopEdge.x + loginBtn.width / 4, leftTopEdge.y + loginBtn.height / 4);
				// robot.moveMouseSmooth(match.center.x, match.center.y);
				sleep(1000);
				// robot.mouseClick();

				// Save the result
				fs.writeFileSync("./output.jpeg", jpeg.encode({
					data: src.data,
					width: src.size().width,
					height: src.size().height
				}, 50).data);
				console.log('finish login one');
				return loginTwo();
			}

			// const raw_data = {
			// 	data: dst.data,
			// 	width: dst.size().width,
			// 	height: dst.size().height
			// };
			// fs.writeFileSync("login_output.jpg", jpeg.encode(raw_data, 50).data);
			console.log('login button not found');
			src.delete(); dst.delete(); mask.delete();
		}
	} catch (e) {
		throw new Error(e);
	}

}


/**
 * Нажимает кнопку логина на 2 экране
 */
function loginTwo() {
	/** CONFIG */
	const imgJpgPath = "./login_btn-two.jpeg";

	console.log('start login two');
	sleep(2000);

	const loginBtn = jpeg.decode(fs.readFileSync(imgJpgPath));
	sleep(2000);
	const screen = robot.screen.capture();
	const screenBuffer = {
		width: screen.width,
		height: screen.height,
		exifBuffer: undefined,
		data: screen.image,
	};

	if (loginBtn !== null) {
		let src = cv.matFromImageData(screenBuffer);
		let templ = cv.matFromImageData(loginBtn);

		let dst = new cv.Mat();
		let mask = new cv.Mat();
		cv.matchTemplate(src, templ, dst, cv.TM_SQDIFF_NORMED, mask);
		cv.threshold(dst, dst, 0.01, 1, cv.THRESH_BINARY);
		let result = cv.minMaxLoc(dst, mask);
		let maxPoint = result.minLoc;
		let point = new cv.Point(maxPoint.x + templ.cols, maxPoint.y + templ.rows);
		// Находим середину объекта
		const leftTopEdge = { x: (point.x - templ.cols) / 2, y: (point.y -  templ.rows) / 2 };
		robot.moveMouseSmooth(leftTopEdge.x + loginBtn.width / 4, leftTopEdge.y + loginBtn.height / 4);
		sleep(1000);
		robot.mouseClick();
		src.delete(); dst.delete(); mask.delete();
	}
	console.log('finish login two');
}

login();


import robot from 'robotjs';

const sab = new SharedArrayBuffer(4);

function getRandomNumber(num) {
	return Math.floor(Math.random() * num) + 1
}

function sleep(ms) {
	Atomics.wait(new Int32Array(sab), 0, 0, ms);
}

function main() {
	console.log('start');
	sleep(2000);

	const screen = robot.getScreenSize();

	let loopCount = 0;
	while(loopCount < 1000) {
		robot.moveMouseSmooth(screen.width/2 - 20, screen.height/2 + 10);
		robot.mouseClick();
		sleep(1000 * 5);
		robot.moveMouseSmooth(screen.width/2 + 50, screen.height/2 - 50);
		robot.mouseClick();
		sleep(1000 * 5);
		robot.moveMouseSmooth(screen.width/2 - getRandomNumber(500),screen.height/2 - getRandomNumber(200));
		sleep(1000 * 8);
		robot.keyTap('i');
		sleep(1000 * 10);
		robot.keyTap('i');
		sleep(1000 * 2);
		robot.moveMouseSmooth(screen.width/2 - getRandomNumber(500),screen.height/2 - getRandomNumber(100));
		sleep(1000 * 18);
		loopCount += 1;
	}

	console.log('finish');
}

main();
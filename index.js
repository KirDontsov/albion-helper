import robot from 'robotjs';
import { sleep, getRandomNumber } from './utils/index.js';

function main() {
  console.log('start');
  sleep(2000);

  const screen = robot.getScreenSize();

  let loopCount = 0;
  while (loopCount < 1000) {
    robot.moveMouseSmooth(screen.width / 2 + 50, screen.height / 2 - 150);
    // robot.mouseClick();
    sleep(1000 * 2);
    robot.moveMouseSmooth(screen.width / 2 + 50, screen.height / 2 - 50);
    // robot.mouseClick();
    sleep(1000 * 2);
    // robot.moveMouseSmooth(screen.width/2 + 90, screen.height/2 - 150);
    // robot.mouseClick();
    // sleep(1000 * 5);
    robot.moveMouseSmooth(screen.width / 2 - getRandomNumber(500), screen.height / 2 - getRandomNumber(200));
    sleep(1000 * 8);
    robot.keyTap('i');
    sleep(1000 * 5);
    robot.keyTap('i');
    sleep(1000 * 2);
    robot.moveMouseSmooth(screen.width / 2 - getRandomNumber(500), screen.height / 2 - getRandomNumber(100));
    sleep(1000 * 5);
    loopCount += 1;
  }

  console.log('finish');
}

main();

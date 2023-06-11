import { EventBus } from '../eventBus/index.js';
import { loginFirstScreen } from './loginFirstScreen.js';
import { loginSecondScreen } from './loginSecondScreen.js';
import cv from 'opencv.js';
import jpeg from 'jpeg-js';
import fs from 'fs';
import robot from 'robotjs';

/** CONFIG */
const imgJpgPathOne = './login_btn.jpeg';
const imgJpgPathTwo = './login_btn-two.jpeg';
let color = new cv.Scalar(255, 0, 0, 255);
const dstOne = new cv.Mat();
const dstTwo = new cv.Mat();
const maskOne = new cv.Mat();
const maskTwo = new cv.Mat();

const loginBtnOne = jpeg.decode(fs.readFileSync(imgJpgPathOne));
const loginBtnTwo = jpeg.decode(fs.readFileSync(imgJpgPathTwo));
let templOne = cv.matFromImageData(loginBtnOne);
let templTwo = cv.matFromImageData(loginBtnTwo);

// export function main() {
//   const screenOne = robot.screen.capture();
//
//   const screenBufferOne = {
//     width: screenOne.width,
//     height: screenOne.height,
//     exifBuffer: undefined,
//     data: screenOne.image,
//   };
//   let srcOne = cv.matFromImageData(screenBufferOne);
//
//   const success = loginFirstScreen(color, dstOne, maskOne, templOne, loginBtnOne, srcOne);
//   console.log('success', success);
//
//   if (success) {
//     const screenTwo = robot.screen.capture();
//
//     const screenBufferTwo = {
//       width: screenTwo.width,
//       height: screenTwo.height,
//       exifBuffer: undefined,
//       data: screenTwo.image,
//     };
//     let srcTwo = cv.matFromImageData(screenBufferTwo);
//     loginSecondScreen(color, dstTwo, maskTwo, templTwo, loginBtnTwo, srcTwo);
//   }
// }

// main();

export const EVENT_BUS = new EventBus();

EVENT_BUS.subscribeOnce('loginFirstScreen', () => {
  const screen = robot.screen.capture();

  const screenBuffer = {
    width: screen.width,
    height: screen.height,
    exifBuffer: undefined,
    data: screen.image,
  };
  let srcOne = cv.matFromImageData(screenBuffer);

  loginFirstScreen(color, dstOne, maskOne, templOne, loginBtnOne, srcOne);
  // srcOne.delete();
  // dstOne.delete();
  // maskOne.delete();
  // templOne.delete();
});

EVENT_BUS.publish('loginFirstScreen', { msg: 'loginFirstScreen finished!' }, 1);

EVENT_BUS.subscribeOnce('loginFirstScreen', () => {
  const screenTwo = robot.screen.capture();

  const screenBufferTwo = {
    width: screenTwo.width,
    height: screenTwo.height,
    exifBuffer: undefined,
    data: screenTwo.image,
  };
  let srcTwo = cv.matFromImageData(screenBufferTwo);
  loginSecondScreen(color, dstTwo, maskTwo, templTwo, loginBtnTwo, srcTwo);

  // srcTwo.delete();
  // dstTwo.delete();
  // maskTwo.delete();
  // templTwo.delete();
});

EVENT_BUS.publish('loginSecondScreen', { msg: 'loginSecondScreen finished!' }, 1);

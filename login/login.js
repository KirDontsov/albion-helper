import robot from 'robotjs';
import cv from 'opencv.js';
import fs from 'fs';
import pngToJpeg from 'png-to-jpeg';
import jpeg from 'jpeg-js';

import { EVENT_BUS } from './index.js';

/** Конвертация png в jpeg */
function convertPngToJpeg() {
  /** CONFIG */
  const imgPngPath = './tree.png';
  const imgJpgPath = './tree.jpeg';

  pngToJpeg({ quality: 90 })(fs.readFileSync(imgPngPath)).then((output) => fs.writeFileSync(imgJpgPath, output));
}
// convertPngToJpeg();

// loginFirstScreen(imgJpgPathOne);
// loginSecondScreen(imgJpgPathTwo);

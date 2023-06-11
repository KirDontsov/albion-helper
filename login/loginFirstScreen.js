import robot from 'robotjs';
import cv from 'opencv.js';
import fs from 'fs';
import jpeg from 'jpeg-js';
import { sleep } from '../utils/index.js';

const THRESHHOLD = 0.67;

/**
 * Нажимает кнопку логина на 1 экране
 */
export const loginFirstScreen = (color, dst, mask, templ, loginBtn, src) => {
  console.log('start login one');
  sleep(2000);

  try {
    if (!loginBtn) return false;
    cv.matchTemplate(src, templ, dst, cv.TM_CCOEFF_NORMED, mask);
    let newDst = [];
    let start = 0;
    let end = dst.cols;
    const maxPoints = [];
    // Проверяем есть ли совпадения
    for (let i = 0; i < dst.rows; i++) {
      newDst[i] = [];
      for (let k = 0; k < dst.cols; k++) {
        newDst[i][k] = dst.data32F[start];

        if (newDst[i][k] >= THRESHHOLD) {
          maxPoints.push({ x: k, y: i });
        }
        start++;
      }
      start = end;
      end = end + dst.cols;
    }

    if (!maxPoints.length) return false;
    // если есть совпадения, нажимаем на кнопку
    maxPoints.forEach((maxPoint) => {
      const point = new cv.Point(maxPoint.x + templ.cols, maxPoint.y + templ.rows);
      cv.rectangle(src, maxPoint, point, color, 1, cv.LINE_8, 0);
      // Находим левый верхний угол
      const leftTopEdge = { x: (point.x - templ.cols) / 2, y: (point.y - templ.rows) / 2 };

      if (maxPoint.x > 0 && maxPoint.y > 0) {
        fs.writeFileSync(
          './login_output-one.jpeg',
          jpeg.encode(
            {
              data: src.data,
              width: src.size().width,
              height: src.size().height,
            },
            50,
          ).data,
        );

        robot.moveMouseSmooth(leftTopEdge.x + loginBtn.width / 4, leftTopEdge.y + loginBtn.height / 4);
        robot.mouseClick();
        sleep(5000);
        console.log('finish login one');
      }
    });
  } catch (e) {
    throw new Error(e);
  }
  return true;
};

import robot from 'robotjs';
import cv from 'opencv.js';
import fs from 'fs';
import jpeg from 'jpeg-js';
import { sleep } from '../utils/index.js';

const THRESHHOLD = 0.97;

/**
 * Нажимает кнопку логина на 2 экране
 */
export const loginSecondScreen = (color, dst, mask, templ, loginBtn, src) => {
  console.log('start login two');

  try {
    if (!loginBtn) return false;
    cv.matchTemplate(src, templ, dst, cv.TM_CCOEFF_NORMED, mask);

    let result = cv.minMaxLoc(dst, mask);
    let maxPoint = result.minLoc;
    let point = new cv.Point(maxPoint.x + templ.cols, maxPoint.y + templ.rows);
    // Находим середину объекта
    const leftTopEdge = { x: (point.x - templ.cols) / 2, y: (point.y - templ.rows) / 2 };
    robot.moveMouseSmooth(leftTopEdge.x + loginBtn.width / 4, leftTopEdge.y + loginBtn.height / 4);
    sleep(1000);
    robot.mouseClick();
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

    fs.writeFileSync(
      './login_output-two.jpeg',
      jpeg.encode(
        {
          data: src.data,
          width: src.size().width,
          height: src.size().height,
        },
        50,
      ).data,
    );

    if (!maxPoints.length) return false;
    // если есть совпадения, нажимаем на кнопку
    maxPoints.forEach((maxPoint) => {
      const point = new cv.Point(maxPoint.x + templ.cols, maxPoint.y + templ.rows);
      cv.rectangle(src, maxPoint, point, color, 1, cv.LINE_8, 0);
      // Находим левый верхний угол
      const leftTopEdge = { x: (point.x - templ.cols) / 2, y: (point.y - templ.rows) / 2 };

      if (maxPoint.x > 0 && maxPoint.y > 0) {
        fs.writeFileSync(
          './login_output-two.jpeg',
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
        return true;
      }
    });
  } catch (e) {
    throw new Error(e);
  }
  console.log('finish login two');
  return true;
};

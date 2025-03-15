'use client';

import { useEffect, useRef } from "react";
import obelisk from "obelisk.js";

const gradient = ['#121212', '#0e4429', '#006d32', '#26a641', '#39d353'];
const maxCount = 56;

/**
 *
 * @param data = { color: string, contributionCount: number, date: yyyy-mm-dd }[][]
 * @return {JSX.Element}
 * @constructor
 */
export function ObeliskCanvas({ data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    const start = new Date();
    const point = new obelisk.Point(120, 40);
    const pixelView = new obelisk.PixelView(canvas, point);
    const isometricMaxHeight = 120;
    const isometricCubeSize = 16;
    const margin = 2;
    for (let weekIndex = 0; weekIndex < data.length; weekIndex++) {
      const week = data[weekIndex];
      for (let dayIndex = 0; dayIndex < week.length; dayIndex++) {
        const day = week[dayIndex];
        const height = 4 + (day.contributionCount > 0 ? Math.floor((day.contributionCount / maxCount) * isometricMaxHeight) : 0);
        const g = day.color;

        const dimension = new obelisk.CubeDimension(isometricCubeSize, isometricCubeSize, height);
        const p3d = new obelisk.Point3D((isometricCubeSize + margin) * weekIndex, (isometricCubeSize + margin) * dayIndex, 0);
        const color = new obelisk.CubeColor().getByHorizontalColor(Number.parseInt(g.substr(1), 16));


        // キューブ描画
        const cube = new obelisk.Cube(dimension, color, false);
        pixelView.renderObject(cube, p3d);
      }
    }

    // const canvas = canvasRef.current;
    // const ctx = canvas.getContext("2d");
    //
    // // obelisk.js のパラメータ設定
    // const pixelView = new obelisk.PixelView(canvas, new obelisk.Point(200, 200));
    //
    // // カラー設定
    // const color = new obelisk.CubeColor().getByHorizontalColor(obelisk.ColorPattern.GRAY);
    //
    // // 立方体サイズ
    // const dimension = new obelisk.CubeDimension(40, 40, 40);
    //
    // // キューブ描画
    // const cube = new obelisk.Cube(dimension, color);
    // pixelView.renderObject(cube, new obelisk.Point3D(0, 0, 0));

  }, []);

  return <canvas ref={canvasRef} width={1200} height={900} style={{ width: 600, height: 400 }} />;
}

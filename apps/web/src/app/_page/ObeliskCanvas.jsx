'use client';

import {useEffect, useRef } from "react";
import obelisk from "obelisk.js";

const maxCount = 50;

/**
 * dataは最大53もしくは52要素(だと思う)、1つの要素にさらに7要素存在
 *
 * @param data { color: string, contributionCount: number, date: yyyy-mm-dd }[][]
 * @return {JSX.Element}
 * @constructor
 */
export function ObeliskCanvas({ data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // オブジェクトの描画
    const point = new obelisk.Point(64, 70);
    const pixelView = new obelisk.PixelView(canvas, point);

    // 立方体の最大の高さ
    const cubeMaxHeight = 60;

    // 立方体のサイズ
    const cubeSize = 10;

    // 立方体同士の配置間隔
    const gutter = 0;

    data.forEach((week, weekIndex) => {
      week.forEach(({ contributionCount: count, color: hexColorCode }, dayIndex) => {
        // 整数にしたカラーコード
        const colorInt = Number.parseInt(hexColorCode.substring(1), 16);

        // 立方体の高さ（4はコミット0の場合の高さ、一日のコミットが100なら最大64になるはず）
        const cubeHeight = 4 + (count > 0 ? Math.floor((50 / maxCount) * cubeMaxHeight) : 0);

        // 立方体
        const dimension = new obelisk.CubeDimension(cubeSize, cubeSize, cubeHeight);
        const p3d = new obelisk.Point3D((cubeSize + gutter) * weekIndex, (cubeSize + gutter) * dayIndex, 0);

        // カラー設定
        const color = new obelisk.CubeColor().getByHorizontalColor(colorInt);

        // キューブ描画
        const cube = new obelisk.Cube(dimension, color, false);
        pixelView.renderObject(cube, p3d);
      });
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={370}
      style={{
        position: 'relative',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: 600,
        maxHeight: 370,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      }}
    />
  );
}

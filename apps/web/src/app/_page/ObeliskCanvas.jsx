'use client';

import { useEffect, useRef } from "react";
import obelisk from "obelisk.js";

export function ObeliskCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // obelisk.js のパラメータ設定
    const pixelView = new obelisk.PixelView(canvas, new obelisk.Point(200, 200));

    // カラー設定
    const color = new obelisk.CubeColor().getByHorizontalColor(obelisk.ColorPattern.GRAY);

    // 立方体サイズ
    const dimension = new obelisk.CubeDimension(40, 40, 40);

    // キューブ描画
    const cube = new obelisk.Cube(dimension, color);
    pixelView.renderObject(cube, new obelisk.Point3D(0, 0, 0));

  }, []);

  return <canvas ref={canvasRef} width={400} height={400} />;
}

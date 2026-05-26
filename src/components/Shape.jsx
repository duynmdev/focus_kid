import React from "react";

/* Vẽ một hình hình học bằng CSS, tách rời MÀU và DẠNG để dùng cho
   trò Hình học và trò Đổi luật. shape = key trong SHAPES (circle/square/
   triangle/rect/star). */
export default function Shape({ shape, color, size = 90 }) {
  return (
    <span
      className={`shape shape-${shape}`}
      style={{ background: color, width: size, height: size }}
      aria-hidden="true"
    />
  );
}

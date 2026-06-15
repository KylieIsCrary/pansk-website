"use client";

import { useEffect, useRef } from "react";
import styles from "./SpatialGallery.module.css";

const asset = (name) => `/assets/${name}`;

const CANVAS_WIDTH_VW = 180;
const CANVAS_HEIGHT_VH = 140;
const CLICK_THRESHOLD = 5;
const DEPTH_KEYS = [2, 3, 4, 5, 6, 7, 8, 9];

const tileOffsets = [-1, 0, 1].flatMap((tileY) => [-1, 0, 1].map((tileX) => ({ tileX, tileY })));

const galleryNodes = [
  { type: "image", id: "on-body-01", src: "community-fit-01.webp", title: "ON BODY 01", category: "CAMO / BLACK TEE", x: 8, y: 12, width: 198, height: 216, depth: 0.32, scale: 0.9, opacity: 0.64, rotate: "-0.8deg" },
  { type: "image", id: "on-body-02", src: "community-fit-02.webp", title: "ON BODY 02", category: "DENIM / CITY", x: 48, y: 22, width: 224, height: 244, depth: 0.72, scale: 1, opacity: 0.92, rotate: "0.6deg" },
  { type: "image", id: "on-body-03", src: "community-fit-03.webp", title: "ON BODY 03", category: "BLACK TEE / JEANS", x: 96, y: 10, width: 204, height: 224, depth: 0.5, scale: 0.94, opacity: 0.76, rotate: "-0.5deg" },
  { type: "image", id: "on-body-04", src: "community-fit-04.webp", title: "ON BODY 04", category: "UTILITY / RELAXED", x: 140, y: 24, width: 220, height: 240, depth: 0.86, scale: 1.03, opacity: 0.95, rotate: "0.8deg" },
  { type: "image", id: "on-body-05", src: "community-fit-05.webp", title: "ON BODY 05", category: "WHITE TEE / WIDE PANTS", x: 26, y: 54, width: 214, height: 234, depth: 0.54, scale: 0.96, opacity: 0.8, rotate: "0.4deg" },
  { type: "image", id: "on-body-06", src: "community-fit-06.webp", title: "ON BODY 06", category: "DENIM SHIRT / DAILY", x: 76, y: 64, width: 194, height: 212, depth: 0.38, scale: 0.88, opacity: 0.66, rotate: "-0.9deg" },
  { type: "image", id: "on-body-07", src: "community-fit-07.webp", title: "ON BODY 07", category: "RAW DENIM / TODAY", x: 122, y: 58, width: 230, height: 250, depth: 0.94, scale: 1.06, opacity: 1, rotate: "-0.4deg" },
  { type: "image", id: "on-body-08", src: "community-fit-08.webp", title: "ON BODY 08", category: "GRAPHIC TEE / BLUE JEANS", x: 164, y: 50, width: 200, height: 218, depth: 0.42, scale: 0.9, opacity: 0.68, rotate: "0.9deg" },
  { type: "image", id: "on-body-09", src: "community-fit-09.webp", title: "ON BODY 09", category: "CARGO / BLACK LAYER", x: 6, y: 104, width: 218, height: 238, depth: 0.68, scale: 0.98, opacity: 0.86, rotate: "-0.6deg" },
  { type: "image", id: "on-body-10", src: "community-fit-10.webp", title: "ON BODY 10", category: "WASHED JACKET / CARGO", x: 54, y: 108, width: 190, height: 208, depth: 0.28, scale: 0.84, opacity: 0.6, rotate: "0.7deg" },
  { type: "image", id: "on-body-11", src: "community-fit-11.webp", title: "ON BODY 11", category: "BLACK DENIM / CLEAN", x: 108, y: 98, width: 222, height: 242, depth: 0.76, scale: 1, opacity: 0.9, rotate: "0.5deg" },
  { type: "image", id: "on-body-12", src: "community-fit-12.webp", title: "ON BODY 12", category: "WIDE DENIM / REAL FIT", x: 152, y: 112, width: 202, height: 220, depth: 0.46, scale: 0.92, opacity: 0.74, rotate: "-0.7deg" },
  { type: "text", id: "canvas-note-01", text: "REAL FITS FROM THE PANSK COMMUNITY", meta: "12 SELECTED RECORDS", x: 62, y: 8, depth: 0.18 },
  { type: "text", id: "canvas-note-02", text: "DRAG THE SURFACE, NOT THE PHOTOS", meta: "INFINITE CANVAS", x: 132, y: 74, depth: 0.24 },
  { type: "link", id: "canvas-link-01", label: "DOUYIN / PANSK88888", href: "https://www.douyin.com/search/Pansk88888?type=user", x: 24, y: 128, depth: 0.16 },
];

const repeatedNodes = tileOffsets.flatMap(({ tileX, tileY }) =>
  galleryNodes.map((node) => ({
    ...node,
    tileX,
    tileY,
    clone: tileX !== 0 || tileY !== 0,
    repeatId: `${node.id}-${tileX}-${tileY}`,
  })),
);

const galleryImageSources = galleryNodes.filter((node) => node.type === "image").map((node) => asset(node.src));

const wrap = (value, size) => {
  if (!size) return value;
  return ((((value + size / 2) % size) + size) % size) - size / 2;
};

export default function SpatialGallery() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const dragRef = useRef({
    isDragging: false,
    hasDragged: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    originX: 0,
    originY: 0,
    offsetX: 0,
    offsetY: 0,
    targetX: 0,
    targetY: 0,
    velocityX: 0,
    velocityY: 0,
    wrapX: 0,
    wrapY: 0,
    pointerX: 0,
    pointerY: 0,
    cursorX: 0,
    cursorY: 0,
    hovering: false,
    reduced: false,
    mobile: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const measure = () => {
      const state = dragRef.current;
      state.reduced = motionQuery.matches;
      state.mobile = mobileQuery.matches;
      state.wrapX = canvas.offsetWidth;
      state.wrapY = canvas.offsetHeight;
    };

    measure();
    window.addEventListener("resize", measure);
    motionQuery.addEventListener?.("change", measure);
    mobileQuery.addEventListener?.("change", measure);

    return () => {
      window.removeEventListener("resize", measure);
      motionQuery.removeEventListener?.("change", measure);
      mobileQuery.removeEventListener?.("change", measure);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const warmupImages = galleryImageSources.map((src) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = src;
      image.decode?.().catch(() => undefined);
      return image;
    });

    return () => {
      warmupImages.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, []);

  const render = () => {
    const canvas = canvasRef.current;
    const state = dragRef.current;
    if (!canvas) return;

    if (!state.isDragging && !state.reduced && !state.mobile) {
      state.targetX += state.velocityX;
      state.targetY += state.velocityY;
      state.velocityX *= 0.92;
      state.velocityY *= 0.92;
    }

    state.offsetX += (state.targetX - state.offsetX) * (state.isDragging ? 0.34 : 0.16);
    state.offsetY += (state.targetY - state.offsetY) * (state.isDragging ? 0.34 : 0.16);
    canvas.style.setProperty("--canvas-x", `${wrap(state.offsetX, state.wrapX).toFixed(2)}px`);
    canvas.style.setProperty("--canvas-y", `${wrap(state.offsetY, state.wrapY).toFixed(2)}px`);
    const parallaxScale = state.isDragging || state.reduced || state.mobile ? 0 : 1;
    DEPTH_KEYS.forEach((depth) => {
      canvas.style.setProperty(`--parallax-x-${depth}`, `${(state.pointerX * depth * 0.9 * parallaxScale).toFixed(2)}px`);
      canvas.style.setProperty(`--parallax-y-${depth}`, `${(state.pointerY * depth * 0.7 * parallaxScale).toFixed(2)}px`);
    });

    if (sectionRef.current) {
      sectionRef.current.style.setProperty("--cursor-x", `${state.cursorX.toFixed(2)}px`);
      sectionRef.current.style.setProperty("--cursor-y", `${state.cursorY.toFixed(2)}px`);
    }

    const moving =
      state.isDragging ||
      Math.abs(state.velocityX) > 0.04 ||
      Math.abs(state.velocityY) > 0.04 ||
      Math.abs(state.targetX - state.offsetX) > 0.35 ||
      Math.abs(state.targetY - state.offsetY) > 0.35;

    if (moving) {
      rafRef.current = requestAnimationFrame(render);
    } else {
      rafRef.current = 0;
    }
  };

  const startLoop = () => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(render);
  };

  const handlePointerMove = (event) => {
    const section = sectionRef.current;
    const state = dragRef.current;
    if (!section || state.mobile) return;

    const rect = section.getBoundingClientRect();
    state.pointerX = (event.clientX - rect.left) / rect.width - 0.5;
    state.pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    state.cursorX = event.clientX - rect.left;
    state.cursorY = event.clientY - rect.top;
    if (!state.hovering) {
      state.hovering = true;
      section.classList.add(styles.isHovering);
    }

    if (state.isDragging) {
      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;
      if (Math.hypot(dx, dy) > CLICK_THRESHOLD) state.hasDragged = true;

      state.velocityX = (event.clientX - state.lastX) * 0.78;
      state.velocityY = (event.clientY - state.lastY) * 0.78;
      state.targetX = state.originX + dx;
      state.targetY = state.originY + dy;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
    }

    startLoop();
  };

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    const state = dragRef.current;
    if (state.reduced || state.mobile) return;

    state.isDragging = true;
    state.hasDragged = false;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.originX = state.targetX;
    state.originY = state.targetY;
    state.velocityX = 0;
    state.velocityY = 0;
    sectionRef.current?.classList.add(styles.isDragging);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    startLoop();
  };

  const handlePointerUp = () => {
    const state = dragRef.current;
    state.isDragging = false;
    sectionRef.current?.classList.remove(styles.isDragging);
    startLoop();
  };

  const handlePointerLeave = () => {
    const section = sectionRef.current;
    dragRef.current.isDragging = false;
    dragRef.current.hovering = false;
    section?.classList.remove(styles.isDragging);
    section?.classList.remove(styles.isHovering);
    startLoop();
  };

  const openProject = (id) => {
    if (dragRef.current.hasDragged) {
      window.setTimeout(() => {
        dragRef.current.hasDragged = false;
      }, 0);
      return;
    }
    console.log(`On body archive item: ${id}`);
  };

  return (
    <section
      id="community"
      ref={sectionRef}
      className={styles.section}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      aria-labelledby="spatial-gallery-title"
    >
      <header className={styles.header}>
        <h2 id="spatial-gallery-title">
          <span>ON BODY</span>
          <span>COMMUNITY ARCHIVE</span>
        </h2>
      </header>

      <div
        ref={canvasRef}
        className={styles.canvas}
        style={{ "--canvas-width": `${CANVAS_WIDTH_VW}vw`, "--canvas-height": `${CANVAS_HEIGHT_VH}vh` }}
        aria-label="PANSK spatial on-body gallery"
      >
        {repeatedNodes.map((item) => {
          const nodeStyle = {
            "--x": `${item.x}vw`,
            "--y": `${item.y}vh`,
            "--tile-x": `${item.tileX * CANVAS_WIDTH_VW}vw`,
            "--tile-y": `${item.tileY * CANVAS_HEIGHT_VH}vh`,
            "--float-x": `var(--parallax-x-${Math.round((item.depth ?? 0.4) * 10)})`,
            "--float-y": `var(--parallax-y-${Math.round((item.depth ?? 0.4) * 10)})`,
            "--depth-scale": item.scale ?? 1,
            "--depth-opacity": item.opacity ?? 1,
            "--rotate": item.rotate ?? "0deg",
          };
          const className = `${styles.node} ${item.clone ? styles.cloneNode : ""}`;

          if (item.type === "text") {
            return (
              <div
                key={item.repeatId}
                className={`${className} ${styles.textNode}`}
                style={nodeStyle}
                aria-hidden={item.clone}
              >
                <p>{item.text}</p>
                <span>{item.meta}</span>
              </div>
            );
          }

          if (item.type === "link") {
            return (
              <a
                key={item.repeatId}
                className={`${className} ${styles.linkNode}`}
                style={nodeStyle}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                tabIndex={item.clone ? -1 : 0}
                aria-hidden={item.clone}
                onClick={(event) => {
                  if (dragRef.current.hasDragged) event.preventDefault();
                }}
              >
                {item.label}
              </a>
            );
          }

          return (
            <button
              key={item.repeatId}
              className={`${className} ${styles.item}`}
              style={{
                ...nodeStyle,
                "--w": `${item.width}px`,
                "--h": `${item.height}px`,
              }}
              type="button"
              tabIndex={item.clone ? -1 : 0}
              aria-hidden={item.clone}
              onClick={() => openProject(item.id)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- The infinite canvas preloads these local WebP assets manually so cloned nodes reuse the same decoded browser cache. */}
              <img
                src={asset(item.src)}
                alt={item.clone ? "" : `${item.title} ${item.category}`}
                loading="eager"
                decoding="async"
                draggable={false}
              />
              <span className={styles.caption}>
                <strong>{item.title}</strong>
                <small>{item.category}</small>
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.cursor} aria-hidden="true">drag</div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import styles from "./SpatialGallery.module.css";

const asset = (name) => `/assets/${name}`;

const WORLD_WIDTH_FACTOR = 2.6;
const WORLD_HEIGHT_FACTOR = 1.7;
const CLICK_THRESHOLD = 5;
const MAX_VELOCITY = 32;
const STOP_VELOCITY = 0.05;

const galleryNodes = [
  { type: "image", id: "on-body-01", src: "community-fit-01.webp", title: "ON BODY 01", category: "CAMO / BLACK TEE", worldX: 0.06, worldY: 0.08, width: 198, height: 216, depth: 0.32, scale: 0.9, opacity: 0.64, rotate: "-0.8deg" },
  { type: "image", id: "on-body-02", src: "community-fit-02.webp", title: "ON BODY 02", category: "DENIM / CITY", worldX: 0.2, worldY: 0.14, width: 224, height: 244, depth: 0.72, scale: 1, opacity: 0.92, rotate: "0.6deg" },
  { type: "image", id: "on-body-03", src: "community-fit-03.webp", title: "ON BODY 03", category: "BLACK TEE / JEANS", worldX: 0.42, worldY: 0.05, width: 204, height: 224, depth: 0.5, scale: 0.94, opacity: 0.76, rotate: "-0.5deg" },
  { type: "image", id: "on-body-04", src: "community-fit-04.webp", title: "ON BODY 04", category: "UTILITY / RELAXED", worldX: 0.63, worldY: 0.16, width: 220, height: 240, depth: 0.86, scale: 1.03, opacity: 0.95, rotate: "0.8deg" },
  { type: "image", id: "on-body-05", src: "community-fit-05.webp", title: "ON BODY 05", category: "WHITE TEE / WIDE PANTS", worldX: 0.86, worldY: 0.1, width: 214, height: 234, depth: 0.54, scale: 0.96, opacity: 0.8, rotate: "0.4deg" },
  { type: "image", id: "on-body-06", src: "community-fit-06.webp", title: "ON BODY 06", category: "DENIM SHIRT / DAILY", worldX: 0.12, worldY: 0.46, width: 194, height: 212, depth: 0.38, scale: 0.88, opacity: 0.66, rotate: "-0.9deg" },
  { type: "image", id: "on-body-07", src: "community-fit-07.webp", title: "ON BODY 07", category: "RAW DENIM / TODAY", worldX: 0.34, worldY: 0.52, width: 230, height: 250, depth: 0.94, scale: 1.06, opacity: 1, rotate: "-0.4deg" },
  { type: "image", id: "on-body-08", src: "community-fit-08.webp", title: "ON BODY 08", category: "GRAPHIC TEE / BLUE JEANS", worldX: 0.56, worldY: 0.44, width: 200, height: 218, depth: 0.42, scale: 0.9, opacity: 0.68, rotate: "0.9deg" },
  { type: "image", id: "on-body-09", src: "community-fit-09.webp", title: "ON BODY 09", category: "CARGO / BLACK LAYER", worldX: 0.78, worldY: 0.5, width: 218, height: 238, depth: 0.68, scale: 0.98, opacity: 0.86, rotate: "-0.6deg" },
  { type: "image", id: "on-body-10", src: "community-fit-10.webp", title: "ON BODY 10", category: "WASHED JACKET / CARGO", worldX: 0.04, worldY: 0.82, width: 190, height: 208, depth: 0.28, scale: 0.84, opacity: 0.6, rotate: "0.7deg" },
  { type: "image", id: "on-body-11", src: "community-fit-11.webp", title: "ON BODY 11", category: "BLACK DENIM / CLEAN", worldX: 0.48, worldY: 0.76, width: 222, height: 242, depth: 0.76, scale: 1, opacity: 0.9, rotate: "0.5deg" },
  { type: "image", id: "on-body-12", src: "community-fit-12.webp", title: "ON BODY 12", category: "WIDE DENIM / REAL FIT", worldX: 0.9, worldY: 0.8, width: 202, height: 220, depth: 0.46, scale: 0.92, opacity: 0.74, rotate: "-0.7deg" },
  { type: "text", id: "canvas-note-01", text: "REAL FITS FROM THE PANSK COMMUNITY", meta: "12 SELECTED RECORDS", worldX: 0.26, worldY: 0.06, depth: 0.18 },
  { type: "text", id: "canvas-note-02", text: "DRAG THE SURFACE, NOT THE PHOTOS", meta: "CONTINUOUS CAMERA", worldX: 0.68, worldY: 0.38, depth: 0.24 },
  { type: "link", id: "canvas-link-01", label: "DOUYIN / PANSK88888", href: "https://www.douyin.com/search/Pansk88888?type=user", worldX: 0.22, worldY: 0.88, depth: 0.16 },
];

const galleryImageSources = galleryNodes.filter((node) => node.type === "image").map((node) => asset(node.src));

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const finite = (value, fallback = 0) => (Number.isFinite(value) ? value : fallback);

const projectAxis = (worldPosition, camera, worldSize, viewportSize, itemSize = 0) => {
  if (!worldSize || !viewportSize) return worldPosition;

  const raw = worldPosition - camera;
  const anchor = (viewportSize - itemSize) / 2;
  const cycle = Math.round((anchor - raw) / worldSize);

  return raw + cycle * worldSize;
};

const paintScene = (state, nodeRefs, section) => {
  const parallaxScale = state.isDragging || state.reduced ? 0 : 1;

  galleryNodes.forEach((item) => {
    const element = nodeRefs.get(item.id);
    if (!element) return;

    const worldX = item.worldX * state.worldWidth;
    const worldY = item.worldY * state.worldHeight;
    const screenX = projectAxis(worldX, state.cameraX, state.worldWidth, state.viewportWidth, item.width ?? 0);
    const screenY = projectAxis(worldY, state.cameraY, state.worldHeight, state.viewportHeight, item.height ?? 0);
    const depth = Math.round((item.depth ?? 0.4) * 10);
    const floatX = state.pointerX * depth * 0.85 * parallaxScale;
    const floatY = state.pointerY * depth * 0.65 * parallaxScale;

    element.style.setProperty("--screen-x", `${screenX.toFixed(2)}px`);
    element.style.setProperty("--screen-y", `${screenY.toFixed(2)}px`);
    element.style.setProperty("--float-x", `${floatX.toFixed(2)}px`);
    element.style.setProperty("--float-y", `${floatY.toFixed(2)}px`);
  });

  section.style.setProperty("--cursor-x", `${state.cursorX.toFixed(2)}px`);
  section.style.setProperty("--cursor-y", `${state.cursorY.toFixed(2)}px`);
};

export default function SpatialGallery() {
  const sectionRef = useRef(null);
  const layerRef = useRef(null);
  const rafRef = useRef(0);
  const nodeRefs = useRef(new Map());
  const dragRef = useRef({
    isDragging: false,
    hasDragged: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    originCameraX: 0,
    originCameraY: 0,
    cameraX: 0,
    cameraY: 0,
    targetCameraX: 0,
    targetCameraY: 0,
    velocityX: 0,
    velocityY: 0,
    viewportWidth: 1,
    viewportHeight: 1,
    worldWidth: 1,
    worldHeight: 1,
    activePointerId: null,
    pointerX: 0,
    pointerY: 0,
    cursorX: 0,
    cursorY: 0,
    hovering: false,
    reduced: false,
    mobile: false,
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 760px)");

    const measure = () => {
      const state = dragRef.current;
      state.reduced = motionQuery.matches;
      state.mobile = mobileQuery.matches;
      state.viewportWidth = Math.max(section.clientWidth, 1);
      state.viewportHeight = Math.max(section.clientHeight, 1);
      state.worldWidth = state.viewportWidth * WORLD_WIDTH_FACTOR;
      state.worldHeight = state.viewportHeight * WORLD_HEIGHT_FACTOR;

      if (!state.mobile) paintScene(state, nodeRefs.current, section);
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
    const state = dragRef.current;
    const section = sectionRef.current;

    if (!section || state.mobile) {
      rafRef.current = 0;
      return;
    }

    if (!state.isDragging && !state.reduced) {
      state.targetCameraX = finite(state.targetCameraX + state.velocityX);
      state.targetCameraY = finite(state.targetCameraY + state.velocityY);
      state.velocityX *= 0.92;
      state.velocityY *= 0.92;
    }

    state.cameraX += (state.targetCameraX - state.cameraX) * (state.isDragging ? 0.34 : 0.16);
    state.cameraY += (state.targetCameraY - state.cameraY) * (state.isDragging ? 0.34 : 0.16);
    state.cameraX = finite(state.cameraX);
    state.cameraY = finite(state.cameraY);

    paintScene(state, nodeRefs.current, section);

    const moving =
      state.isDragging ||
      Math.abs(state.velocityX) > STOP_VELOCITY ||
      Math.abs(state.velocityY) > STOP_VELOCITY ||
      Math.abs(state.targetCameraX - state.cameraX) > 0.35 ||
      Math.abs(state.targetCameraY - state.cameraY) > 0.35;

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
      const deltaX = event.clientX - state.lastX;
      const deltaY = event.clientY - state.lastY;

      if (Math.hypot(dx, dy) > CLICK_THRESHOLD) state.hasDragged = true;

      state.velocityX = clamp(-deltaX * 0.78, -MAX_VELOCITY, MAX_VELOCITY);
      state.velocityY = clamp(-deltaY * 0.78, -MAX_VELOCITY, MAX_VELOCITY);
      state.targetCameraX = finite(state.originCameraX - dx);
      state.targetCameraY = finite(state.originCameraY - dy);
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
    state.originCameraX = state.targetCameraX;
    state.originCameraY = state.targetCameraY;
    state.velocityX = 0;
    state.velocityY = 0;
    state.activePointerId = event.pointerId;
    sectionRef.current?.classList.add(styles.isDragging);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    startLoop();
  };

  const handlePointerUp = (event) => {
    const state = dragRef.current;
    state.isDragging = false;

    if (state.activePointerId !== null) {
      if (event.currentTarget.hasPointerCapture?.(state.activePointerId)) {
        event.currentTarget.releasePointerCapture?.(state.activePointerId);
      }
      state.activePointerId = null;
    }

    sectionRef.current?.classList.remove(styles.isDragging);
    startLoop();
  };

  const handlePointerLeave = () => {
    const section = sectionRef.current;
    const state = dragRef.current;
    state.hovering = false;
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

      <div ref={layerRef} className={styles.layer} aria-label="PANSK spatial on-body gallery">
        {galleryNodes.map((item) => {
          const nodeStyle = {
            "--depth-scale": item.scale ?? 1,
            "--depth-opacity": item.opacity ?? 1,
            "--rotate": item.rotate ?? "0deg",
          };

          const bindNode = (element) => {
            if (element) nodeRefs.current.set(item.id, element);
            else nodeRefs.current.delete(item.id);
          };

          if (item.type === "text") {
            return (
              <div
                key={item.id}
                ref={bindNode}
                className={`${styles.node} ${styles.textNode}`}
                style={nodeStyle}
              >
                <p>{item.text}</p>
                <span>{item.meta}</span>
              </div>
            );
          }

          if (item.type === "link") {
            return (
              <a
                key={item.id}
                ref={bindNode}
                className={`${styles.node} ${styles.linkNode}`}
                style={nodeStyle}
                href={item.href}
                target="_blank"
                rel="noreferrer"
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
              key={item.id}
              ref={bindNode}
              className={`${styles.node} ${styles.item}`}
              style={{
                ...nodeStyle,
                "--w": `${item.width}px`,
                "--h": `${item.height}px`,
              }}
              type="button"
              onClick={() => openProject(item.id)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- The continuous camera canvas preloads local WebP assets manually for smoother movement. */}
              <img
                src={asset(item.src)}
                alt={`${item.title} ${item.category}`}
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

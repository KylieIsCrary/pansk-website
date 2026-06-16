"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./LookbookPinnedSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const asset = (name) => `/assets/${name}`;
const INTRO_TITLE = "\u4ece\u5355\u54c1\uff0c\u5230\u5b8c\u6574\u7a7f\u642d";

const looks = [
  {
    type: "look",
    image: "lookbook-04-sea-closeup.webp",
    position: "center center",
    title: "OUTFIT 01",
    index: "001",
    label: "SEA / CLOSE-UP / ACCESSORY",
    copy: "A CLOSER RECORD OF THE DETAILS THAT MOVE WITH THE BODY.",
  },
  {
    type: "look",
    image: "lookbook-03-forest-road.webp",
    position: "center center",
    title: "OUTFIT 02",
    index: "002",
    label: "FOREST / ROAD / BLACK TEE",
    copy: "REAL FITS LEAVE THE CITY AND KEEP THEIR SHAPE OUTSIDE IT.",
  },
  {
    type: "look",
    image: "lookbook-02-bridge-fit.webp",
    position: "center center",
    title: "OUTFIT 03",
    index: "003",
    label: "BRIDGE / MESH / CITY",
    copy: "A LIGHTWEIGHT STREET UNIFORM HELD AGAINST STEEL AND SUN.",
  },
  {
    type: "look",
    image: "lookbook-01-city-street.webp",
    position: "center center",
    title: "OUTFIT 04",
    index: "004",
    label: "CITY / STREET / WHITE TEE",
    copy: "OFFICIAL PIECES ENTER THE STREET AND BECOME DAILY MEMORY.",
  },
  {
    type: "look",
    image: "lookbook-05-lake-walk.webp",
    position: "center center",
    title: "OUTFIT 05",
    index: "005",
    label: "LAKE / WALK / QUIET DAILY",
    copy: "THE CLOTHES MOVE INTO OPEN AIR, WATER, GRASS AND REAL LIFE.",
  },
];

const slides = [
  {
    type: "intro",
    id: "intro",
    title: INTRO_TITLE,
    subtitle: "FROM PRODUCT TO STYLING",
  },
  ...looks,
];

export default function LookbookPinnedSection() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const spreadRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const spreadSlides = spreadRefs.current.filter(Boolean);
    if (!section || !stage || spreadSlides.length === 0) return undefined;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set(spreadSlides[0], { yPercent: 0, zIndex: 1 });
      gsap.set(spreadSlides.slice(1), { yPercent: 100 });
      spreadSlides.forEach((slide, index) => {
        gsap.set(slide, { zIndex: index + 1 });
      });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          pin: stage,
          pinSpacing: true,
          start: "top top",
          end: () => `+=${window.innerHeight * (looks.length + 0.75)}`,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      spreadSlides.slice(1).forEach((slide, index) => {
        timeline.to(
          slide,
          {
            yPercent: 0,
            duration: 1,
          },
          index,
        );
      });

      ScrollTrigger.refresh();

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    });

    mm.add("(max-width: 760px), (prefers-reduced-motion: reduce)", () => {
      gsap.set(spreadSlides, { clearProps: "all" });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="styled" className={styles.lookbookSection} aria-labelledby="lookbook-pinned-title">
      <div ref={stageRef} className={styles.stage}>
        {slides.map((slide, index) => (
          <article
            key={slide.id || slide.title}
            className={`${styles.spreadSlide} ${slide.type === "intro" ? styles.introSlide : ""}`}
            ref={(node) => {
              spreadRefs.current[index] = node;
            }}
          >
            {slide.type === "intro" ? (
              <div className={styles.introContent}>
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
              </div>
            ) : (
              <>
                <div className={styles.leftPanel}>
                  <div className={styles.panelMeta}>
                    <span>PANSK LOOKS ARCHIVE</span>
                    <span>PANSK OFFICIAL LOOKBOOK</span>
                  </div>

                  <div className={styles.panelBody}>
                    <span className={styles.count}>
                      {slide.index} / {String(looks.length).padStart(3, "0")}
                    </span>
                    <strong id={index === 1 ? "lookbook-pinned-title" : undefined}>{slide.title}</strong>
                    <small>{slide.label}</small>
                    <p>{slide.copy}</p>
                  </div>

                  <div className={styles.panelFooter}>
                    <span>FROM PRODUCT TO STYLING</span>
                  </div>
                </div>

                <div className={styles.rightPanel}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- Local lookbook WebP files render more reliably here without the optimizer layer. */}
                  <img
                    className={styles.image}
                    style={{ objectPosition: slide.position }}
                    src={asset(slide.image)}
                    alt={`${slide.title} official look`}
                  />
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

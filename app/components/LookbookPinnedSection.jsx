"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./LookbookPinnedSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const asset = (name) => `/assets/${name}`;
const INTRO_TITLE = "\u4ece\u5355\u54c1\uff0c\u5230\u5b8c\u6574\u7a7f\u642d";
const FOOTER_LINE = "\u8863\u670d\u6700\u7ec8\u8981\u8d70\u8fdb\u771f\u5b9e\u751f\u6d3b";

const looks = [
  {
    type: "look",
    image: "look-card-01.jpg",
    position: "58% center",
    title: "CITY UNIFORM",
    index: "001",
    label: "DENIM / UTILITY / DAILY",
    copy: "DENIM, UTILITY SHAPES AND DAILY MOVEMENT FOR THE CITY.",
  },
  {
    type: "look",
    image: "look-card-02.jpg",
    position: "60% center",
    title: "YOUNG DAILY",
    index: "002",
    label: "RELAXED / STREET / LIGHT",
    copy: "RELAXED ATTITUDE FOR DAYLIGHT, EVENING AND EVERYWHERE BETWEEN.",
  },
  {
    type: "look",
    image: "look-card-03.jpg",
    position: "58% center",
    title: "ROAD DENIM",
    index: "003",
    label: "WASHED / LOOSE / CITY",
    copy: "WASHED DENIM, LOOSE PROPORTIONS AND A NATURAL STREET RHYTHM.",
  },
  {
    type: "look",
    image: "look-card-04.jpg",
    position: "62% center",
    title: "FIELD STREET",
    index: "004",
    label: "OUTDOOR / CARGO / REAL FIT",
    copy: "OUTDOOR UTILITY MEETS REAL-LIFE STREETWEAR CONDITIONS.",
  },
  {
    type: "look",
    image: "look-card-05.jpg",
    position: "58% center",
    title: "BLACK INDIGO",
    index: "005",
    label: "DARK / INDIGO / UNIFORM",
    copy: "DARK INDIGO LAYERS WITH A CLEAN, DIRECT DAILY UNIFORM FEEL.",
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
                    <span>{FOOTER_LINE}</span>
                  </div>
                </div>

                <div className={styles.rightPanel}>
                  <Image
                    className={styles.image}
                    style={{ objectPosition: slide.position }}
                    src={asset(slide.image)}
                    alt={`${slide.title} official look`}
                    fill
                    sizes="52vw"
                    quality={88}
                    priority={index === 1}
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

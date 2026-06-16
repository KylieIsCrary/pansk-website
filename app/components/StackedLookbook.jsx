"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./StackedLookbook.module.css";

gsap.registerPlugin(ScrollTrigger);

const asset = (name) => `/assets/${name}`;

const INTRO_TITLE = "\u4ece\u5355\u54c1\uff0c\u5230\u5b8c\u6574\u7a7f\u642d";

const looks = [
  {
    image: "look-card-01.jpg",
    title: "CITY UNIFORM",
    index: "001",
    note: "\u725b\u4ed4\u3001\u5de5\u88c5\u4e0e\u65e5\u5e38\u5ed3\u5f62\uff0c\u5728\u57ce\u5e02\u91cc\u81ea\u7136\u79fb\u52a8\u3002",
  },
  {
    image: "look-card-02.jpg",
    title: "YOUNG DAILY",
    index: "002",
    note: "\u8f7b\u677e\u4f46\u6709\u6001\u5ea6\uff0c\u9002\u5408\u4ece\u767d\u5929\u7a7f\u5230\u591c\u665a\u3002",
  },
  {
    image: "look-card-03.jpg",
    title: "ROAD DENIM",
    index: "003",
    note: "\u6c34\u6d17\u725b\u4ed4\u4e0e\u5bbd\u677e\u6bd4\u4f8b\uff0c\u4fdd\u7559\u5e74\u8f7b\u7537\u88c5\u7684\u677e\u5f1b\u611f\u3002",
  },
  {
    image: "look-card-04.jpg",
    title: "FIELD STREET",
    index: "004",
    note: "\u6237\u5916\u611f\u3001\u8857\u5934\u611f\u4e0e\u771f\u5b9e\u751f\u6d3b\u91cc\u7684\u4e0a\u8eab\u72b6\u6001\u3002",
  },
  {
    image: "look-card-05.jpg",
    title: "BLACK INDIGO",
    index: "005",
    note: "\u6df1\u8272\u5c42\u6b21\u4e0e\u65e5\u5e38\u5236\u670d\u611f\uff0c\u5e72\u51c0\u3001\u76f4\u63a5\u3001\u6709\u529b\u91cf\u3002",
  },
];

export default function StackedLookbook() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const cards = cardsRef.current.filter(Boolean);
    if (!section || !stage || cards.length === 0) return undefined;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set(cards, {
        yPercent: 100,
        opacity: 1,
        scale: 1,
        transformOrigin: "50% 50%",
      });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          pin: stage,
          pinSpacing: true,
          start: "top top",
          end: () => `+=${window.innerHeight * (cards.length + 0.25)}`,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, index) => {
        timeline.to(
          card,
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
      gsap.set(cards, { clearProps: "all" });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="styled"
      className={styles.section}
      aria-labelledby="stacked-lookbook-title"
    >
      <header className={styles.intro}>
        <div />
        <p>{INTRO_TITLE}</p>
        <span>FROM PRODUCT TO STYLING</span>
      </header>

      <div ref={stageRef} className={styles.stage}>
        <div className={styles.stack} aria-label="PANSK official stacked look cards">
          {looks.map((look, index) => (
            <article
              key={look.image}
              className={styles.card}
              ref={(node) => {
                cardsRef.current[index] = node;
              }}
              style={{ zIndex: index + 1 }}
            >
              <div className={styles.copyPanel}>
                <div className={styles.brandLine}>
                  <span>PANSK</span>
                  <span>OFFICIAL LOOKBOOK</span>
                </div>
                <p>{look.note}</p>
                <div className={styles.titleRow}>
                  <h2 id={index === 0 ? "stacked-lookbook-title" : undefined}>{look.title}</h2>
                  <strong>{look.index}</strong>
                </div>
              </div>
              <div className={styles.imagePanel}>
                <Image
                  className={styles.image}
                  src={asset(look.image)}
                  alt={`${look.title} official look`}
                  fill
                  sizes="(max-width: 760px) 100vw, 56vw"
                  quality={88}
                  priority={index === 0}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

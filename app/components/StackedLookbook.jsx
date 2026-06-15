"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./StackedLookbook.module.css";

gsap.registerPlugin(ScrollTrigger);

const asset = (name) => `/assets/${name}`;

const looks = [
  { image: "look-card-01.jpg", title: "CITY UNIFORM", index: "001", note: "DENIM / DAILY / MOVEMENT" },
  { image: "look-card-02.jpg", title: "YOUNG DAILY", index: "002", note: "UTILITY / STREET / LIGHT" },
  { image: "look-card-03.jpg", title: "ROAD DENIM", index: "003", note: "WASHED / RELAXED / CITY" },
  { image: "look-card-04.jpg", title: "FIELD STREET", index: "004", note: "CARGO / TEE / OUTSIDE" },
  { image: "look-card-05.jpg", title: "BLACK INDIGO", index: "005", note: "RAW / BLUE / EVERYDAY" },
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
        yPercent: (index) => (index === 0 ? 24 : 114),
        scale: (index) => (index === 0 ? 0.88 : 0.78),
        opacity: (index) => (index === 0 ? 1 : 0),
        transformOrigin: "50% 74%",
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * (cards.length + 0.9)}`,
          pin: stage,
          pinSpacing: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, index) => {
        const at = index * 0.92;
        timeline.to(
          card,
          {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            duration: 0.78,
            ease: "power3.out",
          },
          at,
        );

        if (index < cards.length - 1) {
          timeline.to(
            card,
            {
              yPercent: -8,
              scale: 0.93,
              opacity: 0.38,
              duration: 0.72,
              ease: "power2.out",
            },
            at + 0.7,
          );
        }
      });

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
    <section ref={sectionRef} id="styled" className={styles.section} aria-labelledby="stacked-lookbook-title">
      <div ref={stageRef} className={styles.stage}>
        <header className={styles.header}>
          <p>PANSK</p>
          <nav aria-hidden="true">
            <span>LOOKS</span>
            <span>ARCHIVE</span>
          </nav>
        </header>

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
                <p>PANSK OFFICIAL LOOKBOOK</p>
                <span>{look.note}</span>
              </div>
              <div className={styles.imagePanel}>
                <Image
                  className={styles.image}
                  src={asset(look.image)}
                  alt={`${look.title} official look`}
                  fill
                  sizes="(max-width: 760px) 86vw, 58vw"
                  quality={84}
                  priority={index === 0}
                />
              </div>
              <div className={styles.titlePanel}>
                <h2 id={index === 0 ? "stacked-lookbook-title" : undefined}>{look.title}</h2>
                <strong>{look.index}</strong>
              </div>
              <span className={styles.cornerTag}>PANSK LOOKS</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

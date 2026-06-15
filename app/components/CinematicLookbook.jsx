"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./CinematicLookbook.module.css";

gsap.registerPlugin(ScrollTrigger);

const asset = (name) => `/assets/${name}`;

const looks = [
  { image: "look-card-01.jpg", label: "LOOK 01", note: "CITY / DAILY", size: "large" },
  { image: "look-card-02.jpg", label: "LOOK 02", note: "DENIM / WALK", size: "medium" },
  { image: "look-card-03.jpg", label: "LOOK 03", note: "UTILITY / AIR", size: "portrait" },
  { image: "look-hero-full.png", label: "SINCE 2023", note: "PANSK", size: "wide" },
  { image: "look-card-04.jpg", label: "LOOK 04", note: "FIELD / STREET", size: "mediumTall" },
  { image: "look-card-05.jpg", label: "LOOK 05", note: "BLACK / INDIGO", size: "portrait" },
  { image: "look-card-06.jpg", label: "LOOK 06", note: "DAILY / FIT", size: "medium" },
  { image: "look-card-07.jpg", label: "LOOK 07", note: "RELAXED / LAYER", size: "large" },
];

export default function CinematicLookbook() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!section || !stage || !track) return undefined;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 761px)", () => {
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.08);
      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 1.35, getDistance())}`,
          pin: stage,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.fromTo(
        track,
        { scale: 0.965 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="styled" className={styles.section} aria-labelledby="cinematic-lookbook-title">
      <div ref={stageRef} className={styles.stage}>
        <header className={styles.header}>
          <p>MOTION ARCHIVE</p>
          <h2 id="cinematic-lookbook-title">PANSK LOOKS</h2>
        </header>

        <div ref={trackRef} className={styles.track}>
          {looks.map((look, index) => (
            <article className={`${styles.frame} ${styles[look.size]}`} key={look.image}>
              <Image
                className={styles.image}
                src={asset(look.image)}
                alt=""
                fill
                sizes="(max-width: 760px) 86vw, 42vw"
                quality={84}
                priority={index < 2}
              />
              <div className={styles.meta}>
                <span>{look.label}</span>
                <span>{look.note}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

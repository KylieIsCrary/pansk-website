"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { categorizedProducts } from "./shop-data";

const asset = (name) => `/assets/${name}`;

const menuLinks = [
  { label: "首页", href: "/", kind: "home" },
  { label: "新品", href: "#lookbook", kind: "anchor" },
  { label: "穿搭", href: "#styled", kind: "anchor" },
  { label: "全部商品", href: "/shop", kind: "shop" },
  { label: "关于 PANSK", href: "https://www.douyin.com/search/Pansk88888?type=user", kind: "external" },
];

const heroSlides = [
  {
    image: "hero-new-01.png",
    trigger: "01",
    label: "PANSK 自 2023",
    title: "新的日常",
    subtitle: "去见最好的人",
    objectPosition: "center 46%",
  },
  {
    image: "hero-new-02.png",
    trigger: "02",
    label: "感恩您的上身",
    title: "丹宁",
    subtitle: "工装与城市",
    objectPosition: "center 42%",
  },
  {
    image: "hero-new-03.png",
    trigger: "03",
    label: "年轻人的日常穿搭",
    title: "少年",
    subtitle: "去天涯海角",
    objectPosition: "center 47%",
  },
  {
    image: "hero-new-04.png",
    trigger: "04",
    label: "丹宁 / 工装 / 街头",
    title: "城市",
    subtitle: "日常制服",
    objectPosition: "center 43%",
  },
];

const heroTriggerClasses = ["hero-trigger-01", "hero-trigger-02", "hero-trigger-03", "hero-trigger-scroll"];
const PRODUCT_RAIL_SECONDS_PER_ITEM = 5.4;

const featuredProductIds = [
  "light-blue-denim-jacket",
  "pansk-punk-cat-tee-white",
  "salt-wash-boxy-jacket",
  "indigo-14oz-whisker-jeans",
  "branch-maple-camo-cargo",
  "coffee-wash-denim-jeans",
];

const categorizedProductById = new Map(categorizedProducts.map((product) => [product.id, product]));
const homeProductMeta = {
  "light-blue-denim-jacket": ["浅蓝水洗牛仔夹克", "穿去风里，也穿进日常"],
  "pansk-punk-cat-tee-white": ["朋克猫短袖 T", "把少年感穿在身上"],
  "salt-wash-boxy-jacket": ["水洗炒盐夹克", "旧得刚好，新的出发"],
  "indigo-14oz-whisker-jeans": ["靛蓝猫须牛仔裤", "陪你走很远的路"],
  "branch-maple-camo-cargo": ["树枝枫叶工装裤", "去城市，也去旷野"],
  "coffee-wash-denim-jeans": ["咖啡水洗牛仔裤", "温柔一点的复古"],
  "five-button-kanglong-raw-denim": ["五连扣原牛牛仔裤", "把时间穿成质感"],
  "deep-blue-14oz-honeycomb-jeans": ["蜂窝猫须牛仔裤", "为奔赴而生"],
};
const withHomeProductMeta = (product) => {
  const meta = homeProductMeta[product.id];
  if (!meta) return product;
  return {
    ...product,
    displayTitle: meta[0],
    displaySubtitle: meta[1],
    displayLabel: `${meta[0]} / ${meta[1]}`,
  };
};
const featuredProducts = featuredProductIds
  .map((id) => categorizedProductById.get(id))
  .filter(Boolean)
  .map(withHomeProductMeta);

const streetFitArchive = [
  ["community-fit-01.jpg", "迷彩工装 / 黑色短袖", "-34vw", "-17vh", "-10deg", "0.92"],
  ["community-fit-02.jpg", "水洗牛仔 / 城市层次", "-19vw", "18vh", "7deg", "1"],
  ["community-fit-03.jpg", "黑色短袖 / 宽松牛仔", "0vw", "-23vh", "-4deg", "0.96"],
  ["community-fit-04.jpg", "工装夹克 / 松弛长裤", "23vw", "15vh", "9deg", "1.03"],
  ["community-fit-05.jpg", "白色短袖 / 宽腿长裤", "36vw", "-16vh", "-8deg", "0.9"],
  ["community-fit-06.jpg", "丹宁衬衫 / 日常制服", "-39vw", "14vh", "5deg", "0.88"],
  ["community-fit-07.jpg", "原牛丹宁 / 今日出发", "-24vw", "-30vh", "11deg", "0.9"],
  ["community-fit-08.jpg", "图案短袖 / 蓝色牛仔", "13vw", "29vh", "-7deg", "1"],
  ["community-fit-09.jpg", "工装长裤 / 黑色叠穿", "39vw", "23vh", "6deg", "0.92"],
  ["community-fit-10.jpg", "水洗夹克 / 工装长裤", "-5vw", "24vh", "4deg", "0.97"],
  ["community-fit-11.jpg", "黑色丹宁 / 干净出门", "7vw", "-4vh", "-12deg", "0.86"],
  ["community-fit-12.jpg", "宽松牛仔 / 真实上身", "30vw", "-32vh", "12deg", "0.89"],
  ["community-fit-13.jpg", "城市漫游 / 黑色层次", "-43vw", "-2vh", "13deg", "0.82"],
  ["community-fit-14.jpg", "日常丹宁 / 白色短袖", "-31vw", "31vh", "-13deg", "0.86"],
  ["community-fit-15.jpg", "松弛廓形 / 街头长裤", "-16vw", "-38vh", "6deg", "0.84"],
  ["community-fit-16.jpg", "真实上身 / 城市快照", "18vw", "-37vh", "-15deg", "0.83"],
  ["community-fit-17.jpg", "宽松长裤 / 干净上衣", "43vw", "3vh", "14deg", "0.82"],
  ["community-fit-18.jpg", "黑色短袖 / 日常丹宁", "31vw", "34vh", "-10deg", "0.86"],
  ["community-fit-19.jpg", "宽腿裤型 / 社区穿搭", "-41vw", "36vh", "8deg", "0.8"],
  ["community-fit-20.jpg", "街头制服 / 真实上身", "-8vw", "38vh", "-5deg", "0.83"],
  ["community-fit-21.jpg", "工装情绪 / 城市穿搭", "6vw", "-40vh", "10deg", "0.82"],
  ["community-fit-22.jpg", "丹宁流动 / 真实穿着", "42vw", "-36vh", "-6deg", "0.8"],
  ["community-fit-23.jpg", "年轻男装 / 日常快照", "0vw", "7vh", "15deg", "0.78"],
  ["community-fit-24.jpg", "日常制服 / PANSK", "-28vw", "0vh", "-16deg", "0.8"],
].map(([image, item, , , rotate], index) => {
  const cardHeights = ["420px", "500px", "380px", "460px", "540px", "430px"];
  const safeRotate = Math.max(-8, Math.min(8, Number.parseFloat(rotate)));
  return {
  image: image.replace(".jpg", ".webp"),
  item,
  rotate: `${safeRotate}deg`,
  height: cardHeights[index % cardHeights.length],
  delay: `${index * 55}ms`,
  number: `上身 ${String(index + 1).padStart(2, "0")}`,
  };
});

const lookCards = [
  {
    id: "look-card-01",
    number: "造型 01",
    title: "去见远方",
    subtitle: "黑色短袖 / 宽松牛仔",
    productIds: ["pansk-punk-cat-tee-white", "indigo-14oz-whisker-jeans"],
    image: "look-card-01.jpg",
  },
  {
    id: "look-card-02",
    number: "造型 02",
    title: "城市里也有风",
    subtitle: "水洗夹克 / 日常长裤",
    productIds: ["light-blue-denim-jacket", "plain-12oz-denim-jeans"],
    image: "look-card-02.jpg",
  },
  {
    id: "look-card-03",
    number: "造型 03",
    title: "把旧时光穿新",
    subtitle: "炒盐夹克 / 咖啡牛仔",
    productIds: ["salt-wash-boxy-jacket", "coffee-wash-denim-jeans"],
    image: "look-card-03.jpg",
  },
  {
    id: "look-card-04",
    number: "造型 04",
    title: "向旷野出发",
    subtitle: "朋克猫短袖 / 迷彩工装",
    productIds: ["pansk-punk-cat-tee-white", "branch-maple-camo-cargo"],
    image: "look-card-04.jpg",
  },
  {
    id: "look-card-05",
    number: "造型 05",
    title: "让时间留下痕迹",
    subtitle: "黑色原牛 / 深蓝水洗",
    productIds: ["five-button-kanglong-raw-denim", "deep-blue-14oz-honeycomb-jeans"],
    image: "look-card-05.jpg",
  },
  {
    id: "look-card-06",
    number: "造型 06",
    title: "今天也要好好出门",
    subtitle: "图案短袖 / 直筒牛仔",
    productIds: ["pansk-punk-cat-tee-white", "plain-12oz-denim-jeans"],
    image: "look-card-06.jpg",
  },
  {
    id: "look-card-07",
    number: "造型 07",
    title: "松弛地去生活",
    subtitle: "水洗丹宁 / 城市层次",
    productIds: ["light-blue-denim-jacket", "coffee-wash-denim-jeans"],
    image: "look-card-07.jpg",
  },
];

function SectionKicker({ children }) {
  return <p className="font-serif text-[22px] font-normal italic leading-none text-current">{children}</p>;
}

function TextReveal({ children, className = "" }) {
  return (
    <span className={`split-line ${className}`}>
      <span>{children}</span>
    </span>
  );
}

function Placeholder({ label, dark = false, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center border text-xs uppercase ${
        dark
          ? "slot-grid-dark border-white/20 text-bone/70"
          : "slot-grid border-black/15 text-ink/60"
      } ${className}`}
    >
      <span>{label}</span>
    </div>
  );
}

const sizes = ["XS", "S", "M", "L", "XL"];

function ProductRail({ products, onQuickView }) {
  const railProducts = [...products, ...products];
  const marqueeDuration = `${products.length * PRODUCT_RAIL_SECONDS_PER_ITEM}s`;

  return (
    <div className="category-rail product-wall-rail">
      <div className="products-marquee" aria-label="精选商品滚动展示">
        <div className="products-marquee__track" style={{ "--marquee-duration": marqueeDuration }}>
          {railProducts.map((product, index) => (
            <article
              key={`featured-${product.id}-${index}`}
              className="showcase-product category-product group"
              data-cursor="查看"
              onClick={() => onQuickView(product)}
            >
              <div className="showcase-product__canvas relative overflow-hidden">
                <Image
                  className={`showcase-product__front absolute inset-0 h-full w-full transition duration-700 ease-brand ${
                    product.imageFit === "cover" ? "object-contain p-[clamp(8px,1vw,18px)]" : "object-contain p-[clamp(8px,1vw,18px)]"
                  }`}
                  src={asset(product.front)}
                  alt={`${product.name} 单品图`}
                  fill
                  sizes="(max-width: 900px) 86vw, 38vw"
                />
                <Image
                  className={`showcase-product__back absolute inset-0 h-full w-full opacity-0 transition duration-700 ease-brand ${
                    product.hoverFit === "cover" ? "object-contain p-[clamp(8px,1vw,18px)]" : "object-contain p-[clamp(8px,1vw,18px)]"
                  }`}
                  src={asset(product.back)}
                  alt={`${product.name} 上身图`}
                  fill
                  sizes="(max-width: 900px) 86vw, 38vw"
                />
                <div className="showcase-product__panel absolute bottom-5 left-5 right-5 transition duration-500 ease-brand">
                  <div className="grid grid-cols-[1fr_auto] gap-4 text-[11px] font-black uppercase leading-none tracking-[0.14em]">
                    <h3>{product.displayTitle || product.name}</h3>
                    <ArrowUpRight size={14} />
                  </div>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-ink/45">{product.displaySubtitle || product.note}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function LookStackSection({ onOpenLook }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const dragRef = useRef({ dragging: false, startX: 0 });

  const clampIndex = (index) => Math.max(0, Math.min(lookCards.length - 1, index));
  const goToLook = (index) => setActiveIndex(clampIndex(index));

  const startDrag = (event) => {
    dragRef.current = { dragging: true, startX: event.clientX };
    setDragOffset(0);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const moveDrag = (event) => {
    if (!dragRef.current.dragging) return;
    setDragOffset(event.clientX - dragRef.current.startX);
  };

  const endDrag = () => {
    if (!dragRef.current.dragging) return;
    const threshold = 90;
    if (dragOffset < -threshold) goToLook(activeIndex + 1);
    if (dragOffset > threshold) goToLook(activeIndex - 1);
    dragRef.current.dragging = false;
    setDragOffset(0);
  };

  return (
    <section id="styled" className="look-stack-section">
        <div className="look-stack-stage reveal">
        <div className="look-stack-topline">
          <p>{String(activeIndex + 1).padStart(2, "0")} / {String(lookCards.length).padStart(2, "0")}</p>
        </div>
        <div
          className="look-stack-deck"
          aria-label="PANSK 精选穿搭卡片"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {lookCards.map((look, lookIndex) => {
            const offset = lookIndex - activeIndex;
            const isActive = offset === 0;
            const translate = `calc(${offset} * min(23vw, 300px) + ${isActive ? dragOffset * 0.28 : dragOffset * 0.1}px)`;
            const scale = Math.max(0.84, 1 - Math.abs(offset) * 0.08);
            const opacity = Math.max(0.45, 1 - Math.abs(offset) * 0.2);
            const rotate = offset * 3.5;
            const zIndex = 20 - Math.abs(offset);

            return (
              <article
                key={look.id}
                className={`look-stack-card ${isActive ? "is-active" : ""}`}
                data-look-index={lookIndex}
                style={{
                  "--look-x": translate,
                  "--look-scale": scale,
                  "--look-opacity": opacity,
                  "--look-rotate": `${rotate}deg`,
                  zIndex,
                }}
                onClick={() => {
                  if (!isActive) {
                    goToLook(lookIndex);
                    return;
                  }
                  onOpenLook(look);
                }}
              >
                <div className="look-stack-card-lift" data-cursor={isActive ? "查看" : "聚焦"}>
                  <div className="look-card-media">
                    <Image
                      className="look-card-frame is-active"
                      src={asset(look.image)}
                      alt={`${look.title} 穿搭`}
                      fill
                      sizes="32vw"
                      quality={88}
                      draggable={false}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="look-stack-controls">
          <button type="button" aria-label="上一套穿搭" onClick={() => goToLook(activeIndex - 1)}>
            上一套
          </button>
          <div className="look-stack-progress">
            <span style={{ transform: `scaleX(${(activeIndex + 1) / lookCards.length})` }} />
          </div>
          <button type="button" aria-label="下一套穿搭" onClick={() => goToLook(activeIndex + 1)}>
            下一套
          </button>
        </div>
      </div>
    </section>
  );
}

function ShopLookDrawer({ look, onClose, onQuickView }) {
  if (!look) return null;
  const products = look.productIds.map((id) => categorizedProductById.get(id)).filter(Boolean);

  return (
    <div className="shop-look-overlay" onClick={onClose}>
      <aside className="shop-look-drawer" onClick={(event) => event.stopPropagation()}>
        <button className="shop-look-close" type="button" onClick={onClose} aria-label="关闭穿搭详情">
          <X size={18} />
        </button>
        <div className="shop-look-image">
          <Image src={asset(look.image)} alt={`${look.title} 造型`} fill sizes="44vw" quality={88} />
        </div>
        <div className="shop-look-content">
          <p className="text-xs uppercase tracking-[0.18em] text-bone/45">穿这一套</p>
          <h2>{look.title}</h2>
          <p>{look.subtitle}</p>
          <div className="shop-look-products">
            {products.map((product) => (
              <article key={product.id} className="shop-look-product">
                <div>
                  <Image src={asset(product.front)} alt={product.name} width={82} height={102} />
                </div>
                <section>
                  <p>{homeProductMeta[product.id]?.[1] || product.note}</p>
                  <h3>{homeProductMeta[product.id]?.[0] || product.name}</h3>
                  <button type="button" onClick={() => onQuickView(product)}>
                    查看单品 <ArrowUpRight size={13} />
                  </button>
                </section>
              </article>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function StreetFitArchiveSection() {
  const sectionRef = useRef(null);
  const rafRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [sectionVisible, setSectionVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" }
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!sectionVisible || visibleCount >= streetFitArchive.length) return undefined;
    const timer = window.setTimeout(() => {
      setVisibleCount((count) => Math.min(count + 6, streetFitArchive.length));
    }, 420);
    return () => window.clearTimeout(timer);
  }, [sectionVisible, visibleCount]);

  const handlePointerMove = (event) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    pointerRef.current = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
    };
    const revealX = event.clientX - rect.left;
    const revealY = event.clientY - rect.top;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      section.style.setProperty("--parallax-x", `${pointerRef.current.x * 16}px`);
      section.style.setProperty("--parallax-y", `${pointerRef.current.y * 12}px`);
      section.style.setProperty("--community-x", `${revealX}px`);
      section.style.setProperty("--community-y", `${revealY}px`);
      section.style.setProperty("--community-alpha", "1");
      rafRef.current = 0;
    });
  };

  const handlePointerLeave = () => {
    sectionRef.current?.style.setProperty("--community-alpha", "0");
  };

  const visibleFits = streetFitArchive.slice(0, visibleCount);

  return (
    <section
      id="community"
      ref={sectionRef}
      className="street-fit-section reveal"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="community-letter-field" aria-hidden="true">
        <span>PANSK</span>
        <span>PANSK</span>
        <span>PANSK</span>
        <span>PANSK</span>
        <span>PANSK</span>
      </div>
      <div className="street-fit-heading">
        <div className="street-fit-heading-copy">
          <p>感恩每一次上身，让衣服有了意义与温度</p>
          <span>真实上身 / 去生活里见最好的人</span>
        </div>
      </div>
      <div className="street-fit-wall" aria-label="PANSK 真实上身档案">
        {visibleFits.map((fit, index) => (
          <article
            key={fit.image}
            className="street-fit-card"
            style={{
              "--rotate": fit.rotate,
              "--card-height": fit.height,
              "--delay": fit.delay,
              "--z": index + 1,
            }}
          >
            <Image
              src={asset(fit.image)}
              alt={`${fit.number} ${fit.item}`}
              fill
              sizes="(max-width: 900px) 46vw, 22vw"
              quality={75}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <div className="street-fit-overlay">
              <p>{fit.number}</p>
              <span>{fit.item}</span>
            </div>
          </article>
        ))}
        {visibleCount < streetFitArchive.length ? (
          <div className="street-fit-loading" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function FinalBrandTraceFooter() {
  const footerRef = useRef(null);
  const rafRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const motionRef = useRef({
    active: false,
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    alpha: 0,
    targetAlpha: 0,
    panX: 0,
    panY: 0,
    targetPanX: 0,
    targetPanY: 0,
  });

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.24 },
    );
    observer.observe(footer);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const updateFooterLight = () => {
    const footer = footerRef.current;
    if (!footer) return;
    const state = motionRef.current;
    state.x += (state.tx - state.x) * 0.14;
    state.y += (state.ty - state.y) * 0.14;
    state.alpha += (state.targetAlpha - state.alpha) * 0.12;
    state.panX += (state.targetPanX - state.panX) * 0.1;
    state.panY += (state.targetPanY - state.panY) * 0.1;
    footer.style.setProperty("--footer-x", `${state.x}px`);
    footer.style.setProperty("--footer-y", `${state.y}px`);
    footer.style.setProperty("--footer-light-alpha", state.alpha.toFixed(3));
    footer.style.setProperty("--footer-pan-x", `${state.panX.toFixed(2)}px`);
    footer.style.setProperty("--footer-pan-y", `${state.panY.toFixed(2)}px`);
    if (Math.abs(state.alpha - state.targetAlpha) > 0.01 || state.active) {
      rafRef.current = requestAnimationFrame(updateFooterLight);
    } else {
      rafRef.current = 0;
    }
  };

  const startFooterLightLoop = () => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(updateFooterLight);
  };

  const handleFooterMove = (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const footer = footerRef.current;
    if (!footer) return;
    const rect = footer.getBoundingClientRect();
    const state = motionRef.current;
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const relX = localX / rect.width - 0.5;
    const relY = localY / rect.height - 0.5;
    state.active = true;
    state.tx = localX;
    state.ty = localY;
    state.targetAlpha = 0.52;
    state.targetPanX = relX * -10;
    state.targetPanY = relY * -7;
    startFooterLightLoop();
  };

  const fadeFooterLight = () => {
    const state = motionRef.current;
    state.active = false;
    state.targetAlpha = 0;
    state.targetPanX = 0;
    state.targetPanY = 0;
    startFooterLightLoop();
  };

  const scrollToTop = (event) => {
    event.preventDefault();
    document.querySelector("#hero")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      id="ending"
      ref={footerRef}
      className={`final-brand-footer${isVisible ? " is-visible" : ""}`}
      onPointerMove={handleFooterMove}
      onPointerLeave={fadeFooterLight}
      onMouseLeave={fadeFooterLight}
    >
      <div className="ending-brand-bg" aria-hidden="true">
        <Image
          src={asset("pansk-ending-bg-16x9-1920-overlay-ready.webp")}
          alt=""
          fill
          sizes="100vw"
          quality={75}
          loading="lazy"
        />
      </div>
      <div className="final-brand-poster">
        <h2>PANSK</h2>
        <p>感恩您的上身，赋予它意义与温度</p>
        <span>丹宁 / 工装 / 去天涯海角</span>
      </div>
      <nav className="final-footer-links" aria-label="页脚导航">
        <a href="https://www.douyin.com/search/Pansk88888?type=user" target="_blank" rel="noreferrer">
          关于我们 <ArrowUpRight size={13} />
        </a>
        <a href="/shop">
          全部商品 <ArrowUpRight size={13} />
        </a>
        <a href="#styled">
          穿搭大片 <ArrowUpRight size={13} />
        </a>
        <a href="#community">
          上身档案 <ArrowUpRight size={13} />
        </a>
      </nav>
      <div className="final-footer-meta">
        <a href="https://www.douyin.com/search/Pansk88888?type=user" target="_blank" rel="noreferrer">
          Douyin: Pansk88888
        </a>
        <span>淘宝店铺</span>
      </div>
      <a className="back-to-top" href="#hero" onClick={scrollToTop} data-cursor="顶部">
        回到顶部 <ArrowUpRight size={13} />
      </a>
    </footer>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedLook, setSelectedLook] = useState(null);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");
  const cursorRef = useRef(null);

  useEffect(() => {
    const locked = menuOpen || quickViewProduct || selectedLook;
    document.body.classList.toggle("menu-open", locked);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen, quickViewProduct, selectedLook]);

  useEffect(() => {
    const closeOnEsc = (event) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      setQuickViewProduct(null);
      setSelectedLook(null);
    };
    window.addEventListener("keydown", closeOnEsc);
    return () => window.removeEventListener("keydown", closeOnEsc);
  }, []);

  useEffect(() => {
    const handleScroll = () => setHeaderScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || window.matchMedia("(pointer: coarse)").matches) return undefined;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const move = (event) => {
      tx = event.clientX;
      ty = event.clientY;
      cursor.style.opacity = "1";
    };

    const enter = (event) => {
      const label = event.currentTarget.dataset.cursor || "";
      cursor.textContent = label;
      cursor.classList.add("is-active");
    };

    const leave = () => {
      cursor.textContent = "";
      cursor.classList.remove("is-active");
    };

    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move);
    const interactive = document.querySelectorAll("[data-cursor], a, button");
    interactive.forEach((item) => {
      item.addEventListener("pointerenter", enter);
      item.addEventListener("pointerleave", leave);
    });
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      interactive.forEach((item) => {
        item.removeEventListener("pointerenter", enter);
        item.removeEventListener("pointerleave", leave);
      });
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelector(".preloader")?.remove();
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.86,
    });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    const cleanupFns = [];
    const hidePreloaderTimer = window.setTimeout(() => {
      const preloader = document.querySelector(".preloader");
      if (preloader) preloader.style.display = "none";
    }, 1900);

    const ctx = gsap.context(() => {
      gsap.set(".page-wipe", { yPercent: 101 });

      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(".preloader img", { scale: 0.94, opacity: 0, duration: 0.7, delay: 0.2 })
        .to(".preloader", { yPercent: -100, duration: 0.85 }, "-=0.18")
        .set(".preloader", { display: "none" })
        .fromTo(
          ".site-header",
          { y: -32, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, clearProps: "transform,opacity" },
          "-=0.45"
        )
        .from(".hero-copy .split-line > span", { yPercent: 110, duration: 1, stagger: 0.08 }, "-=0.55")
        .from(".hero-meta", { opacity: 0, y: 18, duration: 0.75, stagger: 0.04 }, "-=0.8");

      gsap.to(".hero-image", {
        scale: 1,
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 70,
          filter: "blur(10px)",
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: element, start: "top 82%" },
        });
      });

      gsap.utils.toArray(".reveal-line").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 60,
          filter: "blur(10px)",
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: element, start: "top 78%" },
        });
      });

      document.querySelectorAll('a[href^="#"]').forEach((link) => {
        const playWipe = () => {
          gsap.killTweensOf(".page-wipe");
          gsap.fromTo(
            ".page-wipe",
            { yPercent: 101 },
            {
              yPercent: -101,
              duration: 0.7,
              ease: "power4.inOut",
              onComplete: () => gsap.set(".page-wipe", { yPercent: 101 }),
            }
          );
        };
        link.addEventListener("click", playWipe);
        cleanupFns.push(() => link.removeEventListener("click", playWipe));
      });
    });

    return () => {
      window.clearTimeout(hidePreloaderTimer);
      cleanupFns.forEach((cleanup) => cleanup());
      ctx.revert();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    if (!menuOpen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      ".menu-link",
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.8, ease: "power4.out", stagger: 0.045 }
    );
    gsap.fromTo(
      ".menu-link",
      { y: 42, opacity: 0, filter: "blur(8px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.78, ease: "power4.out", stagger: 0.06 }
    );
  }, [menuOpen]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      ".hero-copy a, .hero-copy button",
      { y: 34, opacity: 0, filter: "blur(8px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.75, ease: "power4.out", stagger: 0.06 }
    );
  }, [heroIndex]);

  const goToHero = (nextIndex) => {
    setHeroIndex((nextIndex + heroSlides.length) % heroSlides.length);
  };

  const navigateWithWipe = (href) => {
    setMenuOpen(false);
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.location.href = href;
      return;
    }
    gsap.killTweensOf(".page-wipe");
    gsap.fromTo(
      ".page-wipe",
      { yPercent: 101 },
      {
        yPercent: 0,
        duration: 0.58,
        ease: "power4.inOut",
        onComplete: () => {
          window.location.href = href;
        },
      }
    );
  };

  const openQuickView = (product) => {
    if (product.slot && product.id === "video-loop") return;
    setSelectedColor(product.colors?.[0] || "黑色");
    setSelectedSize("M");
    setQuickViewProduct(product);
  };

  return (
    <>
      <div className="preloader" aria-hidden="true">
        <Image className="w-[min(56vw,560px)] contrast-125" src={asset("pansk-logo.png")} alt="" width={1254} height={1254} priority loading="eager" />
      </div>
      <div ref={cursorRef} className="cursor" aria-hidden="true" />
      <div className="page-wipe" aria-hidden="true" />

      <header className={`site-header pointer-events-none fixed left-0 right-0 top-0 z-[120] grid grid-cols-[1fr_auto_1fr] items-start px-6 py-5 text-ink ${headerScrolled ? "is-scrolled" : ""}`}>
        <button className="pointer-events-auto text-left text-[42px] font-black leading-[0.85]" type="button" onClick={() => navigateWithWipe("/")} aria-label="PANSK 首页">
          PANSK
        </button>
        <button
          className="pointer-events-auto relative mt-1 h-6 w-28"
          type="button"
          data-cursor="菜单"
          aria-label="打开菜单"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <span className="menu-line top-[7px]" />
          <span className="menu-line bottom-[7px]" />
        </button>
        <nav className="pointer-events-auto hidden justify-end gap-7 text-sm uppercase md:flex" aria-label="Primary">
          <a className="underline-hover relative uppercase" href="#lookbook">
            新品
          </a>
          <a className="underline-hover relative uppercase" href="#styled">
            穿搭
          </a>
          <button className="underline-hover relative uppercase" type="button" onClick={() => navigateWithWipe("/shop")}>
            商品
          </button>
        </nav>
      </header>

      <div
        className={`menu-shell fixed inset-0 z-[800] grid h-screen grid-rows-[auto_1fr_auto] bg-paper text-ink transition duration-700 ease-brand ${
          menuOpen ? "is-open" : ""
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="grid grid-cols-[1fr_auto] items-start px-6 py-6 uppercase">
          <p className="text-sm font-black">PANSK / 自 2023</p>
          <button
            className="underline-hover relative justify-self-end text-sm font-black uppercase"
            type="button"
            data-cursor="关闭"
            onClick={() => setMenuOpen(false)}
          >
            关闭
          </button>
        </div>
        <nav className="self-start justify-self-center pt-[1vh]" aria-label="菜单">
          {menuLinks.map((item) => {
            const className = "menu-link block text-[clamp(58px,6.8vw,118px)] font-black uppercase leading-[0.86] transition duration-300 hover:translate-x-5 hover:text-signal";
            if (item.kind === "disabled") {
              return (
                <button key={item.label} className={className} type="button" data-cursor="即将">
                  {item.label}
                </button>
              );
            }
            if (item.kind === "external") {
              return (
                <a key={item.label} className={className} href={item.href} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              );
            }
            if (item.kind === "anchor") {
              return (
                <a key={item.label} className={className} href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              );
            }
            return (
              <button key={item.label} className={className} type="button" onClick={() => navigateWithWipe(item.href)}>
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="grid grid-cols-3 items-end px-6 py-6 text-sm font-black uppercase leading-tight">
          <span className="justify-self-start text-left">品牌档案<br />一起出发</span>
          <span className="justify-self-center">Douyin: Pansk88888</span>
          <span className="justify-self-end">PANSK 2023</span>
        </div>
      </div>

      <main>
        <section
          id="hero"
          className="hero-section relative min-h-screen overflow-hidden bg-[#050505] text-bone"
        >
          {heroSlides.map((slide, index) => (
            <div
              key={slide.title}
              className={`hero-slide absolute inset-0 transition-opacity duration-1000 ease-brand ${
                index === heroIndex ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={index !== heroIndex}
            >
              <Image
                className={`hero-image h-full w-full object-cover transition-transform duration-[4500ms] ease-brand ${
                  index === heroIndex ? "scale-[1.08]" : "scale-[1.18]"
                }`}
                style={{ objectPosition: slide.objectPosition }}
                src={asset(slide.image)}
                alt={`${slide.title} hero visual`}
                fill
                priority={index === 0}
                quality={92}
                sizes="100vw"
              />
            </div>
          ))}
          <div className="hero-shade absolute inset-0" />
          <div className="hero-hover-dim absolute inset-0" />
          <div className="hero-meta absolute inset-0 font-serif text-[24px] italic">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.trigger}
                type="button"
                className={`hero-trigger ${heroTriggerClasses[index]} ${index === heroIndex ? "is-active" : ""}`}
                onClick={() => goToHero(index)}
                aria-label={`切换首屏图片 ${slide.trigger}`}
                aria-pressed={index === heroIndex}
                data-cursor={slide.trigger}
              >
                <span>{slide.trigger}</span>
                <span className={`hero-thumb-preview ${index >= 2 ? "is-right" : ""}`} aria-hidden="true">
                  <Image
                    className="h-full w-full object-cover"
                    src={asset(slide.image)}
                    alt=""
                    width={180}
                    height={240}
                    quality={82}
                  />
                </span>
              </button>
            ))}
          </div>
          <div className="hero-copy absolute bottom-[8.5vh] left-6 right-6 max-w-[min(64vw,980px)]">
            <div className="hero-actions">
              <button type="button" onClick={() => navigateWithWipe("/shop")}>SHOP NOW</button>
              <a href="https://www.douyin.com/search/Pansk88888?type=user" target="_blank" rel="noreferrer">ABOUT US</a>
            </div>
          </div>
          <a className="scroll-indicator" href="#philosophy" aria-label="滚动到品牌理念">
            <span />
            Scroll
          </a>
        </section>

        <section id="philosophy" className="brand-philosophy">
          <div className="brand-philosophy-mark reveal">
            <Image src={asset("pansk-logo.png")} alt="PANSK 品牌标志" width={1254} height={1254} />
          </div>
          <div className="brand-philosophy-copy self-start">
            <h2 className="reveal-line">
              想到你穿这件衣服去天涯海角，<br />
              我就很高兴，<br />
              用最好的样子去见最好的人。
            </h2>
          </div>
        </section>

        <LookStackSection onOpenLook={setSelectedLook} />

        <section id="lookbook" className="products-showcase overflow-hidden bg-[#F8F8F6] py-[9vh] text-ink">
          <div className="mb-[8vh] grid grid-cols-3 items-start px-6">
            <p className="text-[clamp(34px,3.8vw,58px)] font-black lowercase leading-none">PANSK</p>
            <div className="justify-self-center text-center">
              <div className="mx-auto mt-2 h-px w-40 bg-ink" />
            </div>
            <button className="justify-self-end text-sm font-black uppercase transition hover:opacity-55" type="button" onClick={() => navigateWithWipe("/shop")}>
              查看全部
            </button>
          </div>
          <ProductRail products={featuredProducts} onQuickView={openQuickView} />
          <div className="mt-[10vh] text-center">
            <button className="border border-transparent px-5 py-3 text-sm font-black uppercase transition hover:border-ink" type="button" onClick={() => navigateWithWipe("/shop")}>
              ( 查看全部商品 )
            </button>
          </div>
        </section>

        <StreetFitArchiveSection />
        <FinalBrandTraceFooter />
      </main>

      <ShopLookDrawer look={selectedLook} onClose={() => setSelectedLook(null)} onQuickView={openQuickView} />

      {quickViewProduct && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/70 px-5 py-8 backdrop-blur-md" onClick={() => setQuickViewProduct(null)}>
          <div
            className="modal-panel grid max-h-[88vh] w-full max-w-[1120px] grid-cols-[1.05fr_0.95fr] overflow-auto border border-white/20 bg-[#0B0B0B] text-bone shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-[620px] bg-[#F1EDE6]">
              {quickViewProduct.slot ? (
                <Placeholder label={quickViewProduct.slot} dark={quickViewProduct.dark} className="h-full w-full border-0" />
              ) : (
                <Image
                  className="h-full w-full object-cover"
                  src={asset(quickViewProduct.back || quickViewProduct.front)}
                  alt={`${quickViewProduct.name} 预览图`}
                  fill
                  sizes="50vw"
                />
              )}
            </div>
            <div className="relative p-8">
              <button
                className="absolute right-6 top-6 border border-white/25 p-2 transition hover:bg-bone hover:text-ink"
                type="button"
                aria-label="关闭快速查看"
                onClick={() => setQuickViewProduct(null)}
              >
                <X size={18} />
              </button>
              <p className="text-xs uppercase tracking-[0.18em] text-bone/45">快速查看</p>
              <h2 className="mt-8 max-w-[520px] text-[clamp(42px,4.8vw,76px)] font-black uppercase leading-[0.92]">
                {quickViewProduct.displayTitle || homeProductMeta[quickViewProduct.id]?.[0] || quickViewProduct.name}
              </h2>
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-bone/45">{quickViewProduct.displaySubtitle || homeProductMeta[quickViewProduct.id]?.[1] || quickViewProduct.note}</p>
              <p className="mt-8 max-w-[560px] text-sm uppercase leading-relaxed text-bone/65">{quickViewProduct.description}</p>

              <div className="mt-10 space-y-8">
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-bone/45">颜色</p>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.colors.map((color) => (
                      <button
                        key={color}
                        className={`border px-4 py-3 text-xs uppercase tracking-[0.14em] transition ${
                          selectedColor === color ? "border-bone bg-bone text-ink" : "border-white/25 text-bone/70 hover:border-bone"
                        }`}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs uppercase tracking-[0.14em] text-bone/55">
                  <div className="border border-white/15 p-4">
                    <p className="text-bone/35">材质</p>
                    <p className="mt-2 text-bone">棉 / 丹宁 / 工装面料</p>
                  </div>
                  <div className="border border-white/15 p-4">
                    <p className="text-bone/35">状态</p>
                    <p className="mt-2 text-bone">查看详情 / 联系下单</p>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-bone/45">尺码</p>
                  <div className="grid grid-cols-5 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={`border py-3 text-xs uppercase transition ${
                          selectedSize === size ? "border-bone bg-bone text-ink" : "border-white/25 text-bone/70 hover:border-bone"
                        }`}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="quick-view-cta" type="button">
                  查看详情 <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { productGroups, shopProducts } from "../shop-data";

const asset = (name) => `/assets/${name}`;

const menuLinks = [
  { label: "Our Shop", href: "/shop", kind: "shop" },
  { label: "Home", href: "/", kind: "home" },
  { label: "About Us", href: "https://www.douyin.com/search/Pansk88888?type=user", kind: "external" },
  { label: "Contact", href: "", kind: "disabled" },
];

const categoryFilters = productGroups.map((group) => ({
  id: group.id,
  label: group.label,
  title: group.title,
  products: group.categories.flatMap((category) => category.products),
  categories: group.categories.map((category) => ({
    id: category.id,
    label: category.label,
    title: category.title,
    products: category.products,
  })),
}));

function ReservedSlot({ label }) {
  return (
    <div className="shop-reserved-slot flex h-full min-h-[420px] items-center justify-center border border-black/10 bg-[#E8E4DC] text-xs font-black uppercase text-ink/45">
      {label}
    </div>
  );
}

function ShopCard({ product, index }) {
  const hasImage = Boolean(product.front);
  const imageFit = product.imageFit === "cover" ? "object-cover p-0" : "object-contain p-[3vw]";
  const hoverFit = product.hoverFit === "cover" ? "object-cover p-0" : "object-contain p-[3vw]";

  return (
    <article id={product.id} className="shop-product-card group" style={{ "--stagger": `${Math.min(index, 11) * 45}ms` }}>
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F3F1ED]">
        {hasImage ? (
          <>
            <Image
              className={`shop-product-front absolute inset-0 h-full w-full transition duration-700 ease-brand ${imageFit}`}
              src={asset(product.front)}
              alt={`${product.name} product view`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              quality={88}
              loading={index === 0 ? "eager" : undefined}
            />
            {product.back ? (
              <Image
                className={`shop-product-back absolute inset-0 h-full w-full opacity-0 transition duration-700 ease-brand ${hoverFit}`}
                src={asset(product.back)}
                alt={`${product.name} worn view`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                quality={88}
              />
            ) : null}
          </>
        ) : (
          <ReservedSlot label={product.slot} />
        )}
      </div>
      <div className="border-t border-black/10 py-4 text-sm font-black uppercase leading-tight">
        <h2>{product.name}</h2>
        <p className="mt-1 text-xs text-ink/45">{product.note}</p>
      </div>
    </article>
  );
}

export default function ShopPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState({ groupId: "all", categoryId: "all" });

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const navigateWithWipe = (href) => {
    if (typeof window === "undefined") return;
    const wipe = document.querySelector(".page-wipe");
    if (!wipe || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.location.href = href;
      return;
    }
    wipe.animate(
      [
        { transform: "translateY(101%)" },
        { transform: "translateY(0)" },
      ],
      { duration: 580, easing: "cubic-bezier(0.76, 0, 0.24, 1)", fill: "forwards" }
    ).onfinish = () => {
      window.location.href = href;
    };
  };

  const activeGroup = categoryFilters.find((group) => group.id === activeFilter.groupId);
  const activeCategory = activeGroup?.categories.find((category) => category.id === activeFilter.categoryId);
  const visibleProducts = activeCategory?.products || activeGroup?.products || shopProducts;
  const activeLabel = activeCategory?.label || activeGroup?.label || "全部商品";

  return (
    <main className="shop-page-enter min-h-screen bg-[#F8F8F6] text-ink">
      <div className="page-wipe" aria-hidden="true" />
      <header className="fixed left-0 right-0 top-0 z-[120] grid grid-cols-[1fr_auto_1fr] items-start px-6 py-5 text-ink">
        <button className="justify-self-start text-left text-[42px] font-black uppercase leading-[0.85]" type="button" onClick={() => navigateWithWipe("/")}>
          PANSK
        </button>
        <button
          className="relative mt-1 h-6 w-28"
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <span className="menu-line top-[7px]" />
          <span className="menu-line bottom-[7px]" />
        </button>
        <p className="justify-self-end text-sm font-black uppercase">Brand Archive</p>
      </header>

      <div
        className={`menu-shell fixed inset-0 z-[800] grid h-screen grid-rows-[auto_1fr_auto] bg-paper text-ink transition duration-700 ease-brand ${
          menuOpen ? "is-open" : ""
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="grid grid-cols-[1fr_auto] items-start px-6 py-6 uppercase">
          <p className="text-sm font-black">PANSK Since 2023</p>
          <button className="underline-hover relative justify-self-end text-sm font-black uppercase" type="button" onClick={() => setMenuOpen(false)}>
            Close
          </button>
        </div>
        <nav className="self-start justify-self-center pt-[1vh]" aria-label="Menu">
          {menuLinks.map((item) => {
            const className = "menu-link block text-[clamp(58px,6.8vw,118px)] font-black uppercase leading-[0.86] transition duration-300 hover:translate-x-5 hover:text-signal";
            if (item.kind === "disabled") {
              return (
                <button key={item.label} className={className} type="button">
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
            return (
              <button key={item.label} className={className} type="button" onClick={() => navigateWithWipe(item.href)}>
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="grid grid-cols-3 items-end px-6 py-6 text-sm font-black uppercase leading-tight">
          <span className="justify-self-start text-left">Brand Archive<br />Join the Fam</span>
          <span className="justify-self-center">Douyin: Pansk88888</span>
          <span className="justify-self-end">PANSK 2023</span>
        </div>
      </div>

      <section className="px-6 pb-[8vh] pt-[15vh]">
        <div className="mb-[8vh] grid grid-cols-[1fr_auto_1fr] items-start">
          <p className="text-sm font-black uppercase">PANSK / Since 2023</p>
          <div className="text-center">
            <p className="font-serif text-[28px] italic leading-none">( All Products )</p>
            <div className="mx-auto mt-2 h-px w-44 bg-ink" />
          </div>
          <p className="justify-self-end text-sm font-black uppercase">{visibleProducts.length} pieces</p>
        </div>
        <div className="mb-[6vh] grid grid-cols-[1fr_auto] items-end gap-8">
          <h1 className="text-[clamp(78px,10vw,170px)] font-black uppercase leading-[0.84]">Our Shop</h1>
          <p className="pb-3 text-right text-sm font-black uppercase tracking-[0.16em] text-ink/45">{activeLabel}</p>
        </div>
        <div className="shop-category-bar mb-[7vh]" aria-label="Product categories">
          <button
            className={`shop-category-button ${activeFilter.groupId === "all" ? "is-active" : ""}`}
            type="button"
            onClick={() => setActiveFilter({ groupId: "all", categoryId: "all" })}
          >
            <span>全部商品</span>
            <small>All</small>
          </button>
          {categoryFilters.map((group) => (
            <div key={group.id} className="shop-category-group">
              <button
                className={`shop-category-button ${activeFilter.groupId === group.id && activeFilter.categoryId === "all" ? "is-active" : ""}`}
                type="button"
                onClick={() => setActiveFilter({ groupId: group.id, categoryId: "all" })}
              >
                <span>{group.label}</span>
                <small>{group.title}</small>
              </button>
              <div className="shop-subcategory-menu">
                {group.categories.map((category) => (
                  <button
                    key={category.id}
                    className={`shop-subcategory-button ${
                      activeFilter.groupId === group.id && activeFilter.categoryId === category.id ? "is-active" : ""
                    }`}
                    type="button"
                    onClick={() => setActiveFilter({ groupId: group.id, categoryId: category.id })}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product, index) => (
            <ShopCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}

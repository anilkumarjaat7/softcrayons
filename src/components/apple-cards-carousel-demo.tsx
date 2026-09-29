"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export default function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <section className="w-full py-24 bg-muted/30">
      <div className="container mb-2">
        <div className="text-center max-w-3xl mx-auto mb-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            Campus <span className="text-gradient">Gallery</span>
          </h2>
        </div>
      </div>
      <Carousel items={cards} />
    </section>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-background p-8 md:p-14 rounded-3xl mb-4 border"
          >
            <img
              src="https://placehold.co/1000x650/e6f4ea/1f2937.png?text=Learning+Milestone"
              alt="Dummy milestone visual"
              height="320"
              width="320"
              className="md:w-2/5 h-auto w-full max-w-xs mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "",
    title: "",
    src: "https://ik.imagekit.io/nbzdsahth/galllary/1.webp",
    content: <DummyContent />,
  },
  {
    category: "",
    title: "",
    src: "https://ik.imagekit.io/nbzdsahth/galllary/3.webp",
    content: <DummyContent />,
  },
  {
    category: "",
    title: "",
    src: "https://ik.imagekit.io/nbzdsahth/galllary/4.webp",
    content: <DummyContent />,
  },

  {
    category: "",
    title: "",
    src: "https://ik.imagekit.io/nbzdsahth/galllary/5.webp",
    content: <DummyContent />,
  },
  {
    category: "",
    title: "",
    src: "https://ik.imagekit.io/nbzdsahth/galllary/6.webp",
    content: <DummyContent />,
  },
  {
    category: "",
    title: "",
    src: "https://ik.imagekit.io/nbzdsahth/galllary/8.webp",
    content: <DummyContent />,
  },
  {
    category: "",
    title: "",
    src: "https://i.ibb.co/20Q2tgKs/gal-8.jpg",
    content: <DummyContent />,
  },
  {
    category: "",
    title: "",
    src: "https://i.ibb.co/vKw5dT3/gal-7.jpg",
    content: <DummyContent />,
  },
  {
    category: "",
    title: "",
    src: "https://i.ibb.co/4DXYfMd/gal-10.jpg",
    content: <DummyContent />,

  }
];

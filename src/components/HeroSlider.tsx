"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface SliderImage {
  id: string;
  url: string;
}

export default function HeroSlider({ images }: { images: SliderImage[] }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    if (images.length < 2) return;

    // Read interval from body data attribute (set by layout from settings)
    const interval = parseInt(
      document.body.getAttribute("data-slider-interval") || "5000",
      10
    );

    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length]);

  if (images.length === 0) {
    return <div className="w-full h-full bg-mx-container" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((img, i) => (
        <div
          key={img.id}
          className="absolute inset-0"
          style={{
            opacity: i === active ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
            zIndex: i === active ? 1 : 0,
          }}
        >
          <Image
            src={img.url}
            alt=""
            fill
            className="object-cover"
            style={{ opacity: 0.4, filter: "grayscale(100%)" }}
            sizes="100vw"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}

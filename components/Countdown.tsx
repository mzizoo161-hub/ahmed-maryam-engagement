"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const EMPTY_TIME: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const EVENT_DATE = new Date("2026-08-08T20:00:00+03:00").getTime();

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(EMPTY_TIME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const difference = EVENT_DATE - Date.now();

      if (difference <= 0) {
        setTimeLeft(EMPTY_TIME);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    setMounted(true);
    updateCountdown();

    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const countdownItems = [
    {
      label: "Days",
      value: timeLeft.days,
    },
    {
      label: "Hours",
      value: timeLeft.hours,
    },
    {
      label: "Minutes",
      value: timeLeft.minutes,
    },
    {
      label: "Seconds",
      value: timeLeft.seconds,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#efe5d7] px-5 py-24 text-center text-[#6b4f3b] md:py-32">
      {/* Background lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,248,230,0.8),transparent_68%)]" />

      <motion.div
        className="pointer-events-none absolute left-[8%] top-[18%] h-52 w-52 rounded-full bg-[#d9b978]/20 blur-[90px]"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="pointer-events-none absolute bottom-[12%] right-[8%] h-60 w-60 rounded-full bg-[#b98e55]/15 blur-[100px]"
        animate={{
          x: [0, -25, 0],
          y: [0, 22, 0],
          scale: [1.08, 0.95, 1.08],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.p
          className="text-xs uppercase tracking-[0.42em] text-[#9b8066] md:text-sm"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          Counting down to our celebration
        </motion.p>

        <motion.h2
          className="mt-5 font-serif text-4xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            delay: 0.15,
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          08 • 08 • 2026
        </motion.h2>

        <motion.div
          className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 md:mt-16 md:grid-cols-4 md:gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            delay: 0.25,
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {countdownItems.map((item, index) => (
            <motion.div
              key={item.label}
              className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/40 px-4 py-8 shadow-[0_22px_60px_rgba(95,69,44,0.14)] backdrop-blur-xl md:px-5 md:py-10"
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.12 * index,
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -7,
                scale: 1.025,
              }}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/55 via-transparent to-[#d8b675]/15 opacity-80" />

              <motion.div
                className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/40 blur-2xl"
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 4 + index,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="relative z-10">
                <motion.div
                  key={mounted ? item.value : item.label}
                  className="font-serif text-5xl leading-none md:text-6xl lg:text-7xl"
                  initial={{ opacity: 0.35, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {mounted
                    ? String(item.value).padStart(2, "0")
                    : "--"}
                </motion.div>

                <div className="mt-4 text-[10px] uppercase tracking-[0.3em] text-[#8f745d] md:text-xs">
                  {item.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="mx-auto mt-12 max-w-2xl font-serif text-xl leading-relaxed text-[#806c5b] md:text-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 1 }}
        >
          Until we celebrate this beautiful beginning together.
        </motion.p>
      </div>
    </section>
  );
}
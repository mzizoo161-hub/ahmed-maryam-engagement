"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import RingScene from "./RingScene";

type Screen = "intro" | "ring" | "invitation";

export default function Hero() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [muted, setMuted] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const introTimer = window.setTimeout(() => {
      setScreen("ring");
    }, 2600);

    return () => window.clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current !== null) {
        window.clearInterval(fadeTimerRef.current);
      }
    };
  }, []);

  const startMusic = async () => {
    const audio = audioRef.current;

    if (!audio || musicStarted) return;

    audio.volume = 0;
    audio.muted = false;

    try {
      await audio.play();
      setMusicStarted(true);
      setMuted(false);

      const targetVolume = 0.15;
      const fadeDuration = 4000;
      const intervalDuration = 100;
      const totalSteps = fadeDuration / intervalDuration;
      const volumeStep = targetVolume / totalSteps;

      if (fadeTimerRef.current !== null) {
        window.clearInterval(fadeTimerRef.current);
      }

      fadeTimerRef.current = window.setInterval(() => {
        if (!audioRef.current) return;

        const nextVolume = Math.min(
          targetVolume,
          audioRef.current.volume + volumeStep
        );

        audioRef.current.volume = nextVolume;

        if (nextVolume >= targetVolume) {
          if (fadeTimerRef.current !== null) {
            window.clearInterval(fadeTimerRef.current);
            fadeTimerRef.current = null;
          }
        }
      }, intervalDuration);
    } catch (error) {
      console.error("Music could not start:", error);
    }
  };

  const openInvitation = async () => {
    await startMusic();
    setScreen("invitation");
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (!musicStarted) {
      await startMusic();
      return;
    }

    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f0e7] text-[#6b4f3b]">
      <audio
        ref={audioRef}
        src="/music/engagement.mp3"
        loop
        preload="auto"
      />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(255,232,179,0.32),transparent_62%)]" />

      <motion.div
        className="pointer-events-none fixed left-[10%] top-[18%] h-56 w-56 rounded-full bg-[#ead4a5]/20 blur-[90px]"
        animate={{
          x: [0, 35, 0],
          y: [0, -25, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="pointer-events-none fixed bottom-[12%] right-[8%] h-64 w-64 rounded-full bg-[#c9a76a]/15 blur-[100px]"
        animate={{
          x: [0, -30, 0],
          y: [0, 25, 0],
          scale: [1.1, 0.95, 1.1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {musicStarted && (
        <motion.button
          type="button"
          onClick={toggleMusic}
          aria-label={muted ? "Unmute music" : "Mute music"}
          className="fixed right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/45 text-lg text-[#6b4f3b] shadow-lg backdrop-blur-xl md:right-8 md:top-8"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          {muted ? "♩" : "♫"}
        </motion.button>
      )}

      <section className="relative flex min-h-screen items-center justify-center px-5 py-12 text-center">
        <AnimatePresence mode="wait">
          {screen === "intro" && (
            <motion.div
              key="intro"
              className="relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 1.12,
                filter: "blur(12px)",
              }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.div
                className="font-serif text-7xl tracking-[0.08em] text-[#8c6b46] md:text-9xl"
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                A
                <motion.span
                  className="mx-5 inline-block text-4xl text-[#b58b54] md:mx-8 md:text-6xl"
                  initial={{ opacity: 0, rotate: -15 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.55, duration: 0.8 }}
                >
                  &
                </motion.span>
                M
              </motion.div>

              <motion.p
                className="mt-7 text-xs uppercase tracking-[0.42em] text-[#9b8066]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                Ahmed & Maryam
              </motion.p>
            </motion.div>
          )}

          {screen === "ring" && (
            <motion.div
              key="ring"
              className="relative z-10 w-full max-w-5xl"
              initial={{
                opacity: 0,
                y: 40,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 1.12,
                filter: "blur(14px)",
              }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.p
                className="mb-4 text-xs uppercase tracking-[0.4em] text-[#9b8066] md:text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                You are invited
              </motion.p>

              <motion.h1
                className="font-serif text-5xl leading-tight md:text-8xl"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.9 }}
              >
                Ahmed & Maryam
              </motion.h1>

              <motion.p
                className="mt-5 text-lg text-[#806c5b] md:text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.8 }}
              >
                Engagement Ceremony
              </motion.p>

              <motion.p
                className="mt-2 text-base text-[#806c5b] md:text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.8 }}
              >
                8 August 2026 • 8:00 PM
              </motion.p>

              <motion.div
                className="mt-2"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.55,
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <RingScene onClick={openInvitation} />
              </motion.div>
            </motion.div>
          )}

          {screen === "invitation" && (
            <motion.div
              key="invitation"
              className="relative z-10 w-full max-w-md md:max-w-xl"
              initial={{
                opacity: 0,
                y: 100,
                scale: 0.8,
                rotateX: 16,
                filter: "blur(14px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: 60,
                scale: 0.9,
              }}
              transition={{
                duration: 1.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformPerspective: 1400 }}
            >
              <motion.p
                className="mb-6 text-xs uppercase tracking-[0.4em] text-[#9b8066]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.8 }}
              >
                Together with their families
              </motion.p>

              <motion.div
                className="rounded-[2rem] border border-white/60 bg-white/40 p-3 shadow-[0_30px_80px_rgba(91,67,44,0.22)] backdrop-blur-xl"
                animate={{
                  y: [0, -7, 0],
                  rotateZ: [-0.25, 0.25, -0.25],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/images/invitation.JPG"
                  alt="Ahmed and Maryam engagement invitation"
                  width={1051}
                  height={1479}
                  priority
                  className="h-auto w-full rounded-[1.5rem] shadow-2xl"
                />
              </motion.div>

              <motion.a
                href="https://maps.app.goo.gl/scEgdihmi3E9DPvY8?g_st=iw"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-[#7d6249] px-9 py-4 text-white shadow-lg"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.7 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 16px 35px rgba(90, 62, 38, 0.28)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                Open in Google Maps
              </motion.a>

              <motion.button
                type="button"
                onClick={() => setScreen("ring")}
                className="mt-5 block w-full text-xs uppercase tracking-[0.26em] text-[#8b7159] transition hover:text-[#5f4736]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back to ring
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
"use client";

import { motion } from "framer-motion";

const details = [
  {
    title: "Date",
    main: "8 August 2026",
    sub: "Saturday",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-8 w-8"
      >
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </svg>
    ),
  },
  {
    title: "Time",
    main: "8:00 PM",
    sub: "Please arrive on time",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-8 w-8"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    title: "Venue",
    main: "Latoya Hall",
    sub: "Egypt View, Mokattam",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-8 w-8"
      >
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
];

export default function EventDetails() {
  return (
    <section className="relative overflow-hidden bg-[#f8f3ec] px-5 py-24 text-[#6b4f3b] md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,245,220,0.75),transparent_68%)]" />

      <motion.div
        className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#d7bb81]/15 blur-[110px]"
        animate={{
          x: [0, 35, 0],
          y: [0, -20, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#a9875b]/12 blur-[120px]"
        animate={{
          x: [0, -30, 0],
          y: [0, 25, 0],
          scale: [1.08, 0.96, 1.08],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <motion.p
          className="text-xs uppercase tracking-[0.42em] text-[#9b8066] md:text-sm"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          Celebration details
        </motion.p>

        <motion.h2
          className="mt-5 font-serif text-5xl md:text-7xl"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            delay: 0.12,
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Save the Date
        </motion.h2>

        <motion.p
          className="mx-auto mt-6 max-w-2xl font-serif text-xl leading-relaxed text-[#806c5b] md:text-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.9 }}
        >
          We would be delighted to celebrate this special evening with you.
        </motion.p>

        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-3">
          {details.map((item, index) => (
            <motion.article
              key={item.title}
              className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/45 px-7 py-10 shadow-[0_24px_65px_rgba(87,62,40,0.13)] backdrop-blur-xl"
              initial={{ opacity: 0, y: 35, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                delay: index * 0.14,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/55 via-transparent to-[#d6b273]/15" />

              <div className="relative z-10">
                <motion.div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#caae83]/50 bg-[#fffaf2]/75 text-[#9a7650] shadow-md"
                  whileHover={{
                    rotate: 5,
                    scale: 1.08,
                  }}
                >
                  {item.icon}
                </motion.div>

                <p className="mt-7 text-xs uppercase tracking-[0.32em] text-[#9b8066]">
                  {item.title}
                </p>

                <h3 className="mt-4 font-serif text-3xl md:text-4xl">
                  {item.main}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-[#806c5b] md:text-base">
                  {item.sub}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="mx-auto mt-14 max-w-3xl rounded-[2rem] border border-white/70 bg-white/40 px-6 py-10 shadow-[0_25px_70px_rgba(87,62,40,0.13)] backdrop-blur-xl md:px-12"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            delay: 0.25,
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#8b6b4a] text-white shadow-lg">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-8 w-8"
            >
              <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.34em] text-[#9b8066]">
            Find the venue
          </p>

          <h3 className="mt-4 font-serif text-4xl md:text-5xl">
            Latoya Hall
          </h3>

          <p className="mt-3 text-[#806c5b]">
            Egypt View, Mokattam
          </p>

          <motion.a
            href="https://maps.app.goo.gl/toH9vPCF7joQmhwc7?g_st=iw"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#7d6249] px-9 py-4 text-white shadow-[0_15px_35px_rgba(88,61,37,0.24)]"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 45px rgba(88,61,37,0.3)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Open in Google Maps</span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-5 w-5"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </motion.a>
        </motion.div>

        <motion.div
          className="mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="font-serif text-3xl italic text-[#725944] md:text-5xl">
            We cannot wait to celebrate with you.
          </p>

          <div className="mx-auto mt-8 h-px w-28 bg-gradient-to-r from-transparent via-[#a88660] to-transparent" />

          <p className="mt-7 text-xs uppercase tracking-[0.4em] text-[#9b8066]">
            Ahmed & Maryam
          </p>
        </motion.div>
      </div>
    </section>
  );
}
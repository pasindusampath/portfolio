"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  BookOpen,
  Code2,
  Cpu,
  Database,
  Briefcase,
  Users,
  Smile,
  Sparkles,
  Drama,
  MessageCircleHeart,
  Quote,
  Globe,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";

/* ─────────────────────────────────────────────
   Constants
   ───────────────────────────────────────────── */

const BIRTHDAY = new Date(2002, 9, 8); // Oct 8, 2002 (month is 0-indexed)

const MILESTONES = [
  {
    date: "April 2021",
    title: "The Beginning",
    description:
      "Started the self-study journey into programming — learning fundamentals from scratch with pure curiosity and determination.",
    Icon: BookOpen,
    skills: ["Programming Fundamentals",
      "Data Representation in Computer Memory",
      "String Manipulation",
      "Bitwise Operations",
      "if-else",
      "Loops",
      "Recursion",
      "Arrays",
      "... Seems like a syllabus anyway moving on..."
    ],
  },
  {
    date: "2021 – 2022",
    title: "Mastering the Core",
    description:
      "Dove deep into computer science concepts that form the backbone of every great software engineer.",
    Icon: Code2,
    skills: ["OOP", "Data Structures"],
  },
  {
    date: "2022 – 2023",
    title: "Enterprise Frameworks",
    description:
      "Learned to build robust, production-grade applications with industry-standard Java frameworks.",
    Icon: Cpu,
    skills: ["Spring Boot", "Hibernate"],
  },
  {
    date: "2023 – 2024",
    title: "Data & Persistence",
    description:
      "Mastered database design, querying, and data management to build data-driven applications.",
    Icon: Database,
    skills: ["Databases", "MySQL"],
  },
  {
    date: "August 2024",
    title: "First Job 🎉",
    description:
      "Officially began professional career as a Software Engineer — turning years of self-study into real-world impact.",
    Icon: Briefcase,
    skills: [],
  },
  {
    date: "2024 – Present",
    title: "Growing with Teams",
    description:
      "Leveling up through real-world collaboration — debugging alongside colleagues, clarifying what customers truly need, and helping teammates succeed.",
    Icon: Users,
    skills: ["Team Collaboration", "Debugging", "Customer Communication"],
  },
];

/* ─────────────────────────────────────────────
   Life Counter Hook
   ───────────────────────────────────────────── */

interface TimeUnits {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useLifeCounter(): TimeUnits | null {
  const [time, setTime] = useState<TimeUnits | null>(null);

  useEffect(() => {
    function calculate(): TimeUnits {
      const now = new Date();

      let years = now.getFullYear() - BIRTHDAY.getFullYear();
      let months = now.getMonth() - BIRTHDAY.getMonth();
      let days = now.getDate() - BIRTHDAY.getDate();

      if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      return {
        years,
        months,
        days,
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      };
    }

    setTime(calculate());
    const interval = setInterval(() => setTime(calculate()), 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

/* ─────────────────────────────────────────────
   Counter Card
   ───────────────────────────────────────────── */

function CounterCard({
  value,
  label,
  delay,
}: {
  value: number;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className="group relative flex flex-col items-center gap-1.5 px-4 py-3 md:px-6 md:py-4 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] min-w-[70px] md:min-w-[100px] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-violet-500/0 group-hover:bg-violet-500/[0.04] transition-colors duration-300" />

      <span className="relative text-2xl md:text-4xl font-bold text-white tabular-nums tracking-tight">
        {String(value).padStart(2, "0")}
      </span>
      <span className="relative text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">
        {label}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Timeline Milestone
   ───────────────────────────────────────────── */

function Milestone({
  milestone,
  index,
}: {
  milestone: (typeof MILESTONES)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { Icon } = milestone;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="relative flex items-start gap-5 md:gap-6 group"
    >
      {/* Timeline dot */}
      <div className="relative z-10 flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30 flex items-center justify-center group-hover:from-violet-500/40 group-hover:to-purple-600/40 group-hover:border-violet-500/50 transition-all duration-300 shadow-lg shadow-violet-500/5">
        <Icon size={18} className="text-violet-400 md:w-5 md:h-5" />
      </div>

      {/* Content card */}
      <div className="flex-1 pb-10 md:pb-12">
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3">
          {milestone.date}
        </span>
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
          {milestone.title}
        </h3>
        <p className="text-gray-400 text-sm md:text-[15px] leading-relaxed mb-3">
          {milestone.description}
        </p>
        {milestone.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {milestone.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.05] text-gray-300 border border-white/[0.08] hover:bg-white/[0.1] transition-colors duration-200"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Testimonials Data
   ───────────────────────────────────────────── */

const TESTIMONIALS = [
  {
    name: "Dasuni Wickramasinghe",
    university: "University of Colombo School of Computing",
    role: "Intern - QA",
    degree: "UCSC Undergraduate",
    review:
      "I recently completed a course on CodeSchool.lk with Pasindu Sampath, covering Java fundamentals, MySQL Databases, Spring Boot, and OOP concepts. His teaching approach is exceptional! He makes even the hardest of concepts look very simple and interesting thus easy for people who have no experience, while at the same time providing valuable insight for experienced persons. Today, because of his practical explanations, I feel that I have a good understanding of these technologies and therefore can see myself using them in real-life situations. For those who want to improve their programming skills, I recommend his courses without any hesitation.",
    linkedin: "https://www.linkedin.com/in/dasuni-wickramasinghe-95b9b428a",
    initials: "DW",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    name: "Nadun Randheera",
    university: "University of Jaffna",
    role: "Undergraduate",
    degree: "ICT Undergraduate",
    review:
      "I recently followed a course on CodeSchool by Pasindu Sampath, covering Spring Boot, JavaScript, databases, and JavaFX. His teaching style is outstanding! The explanations were clear, concise, and easy to follow, even for complex topics. He breaks down concepts in a way that makes them approachable for beginners while still being engaging for those with some experience. Thanks to his excellent guidance, I gained a deeper understanding of these technologies and feel more confident applying them in real-world projects. I highly recommend his courses to anyone looking to build strong programming skills.",
    linkedin: "https://www.linkedin.com/in/nadunrandeera/",
    website: "https://nadundev.netlify.app/",
    initials: "NR",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    name: "Imasha Ekanayake",
    university: "NSBM Green University",
    role: "Undergraduate",
    degree: "BSc (Hons) in Computer Science",
    review:
      "I recently successfully completed several courses on CodeSchool.lk with Pasindu Sampath, covering Java Fundamentals, OOP Concepts, JavaFx, Spring Boot, Javascript and React. His teaching style is excellent! He has a unique teaching style, where he explains even complex things in a simple and clear manner. And he teaches in a very friendly way. Thanks to his excellent guidance, I was able to develop knowledge, understanding, and skills related to programming. I also hope to apply what I learned from him to real-world projects. So I recommend his courses without any hesitation.",
    linkedin: "https://www.linkedin.com/in/imasha-ekanayake-271a5b2ab",
    initials: "IE",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    name: "Waruna Liyanapathirana",
    university: "University of Jaffna",
    role: "Undergraduate",
    degree: "BICT (Hons) Software Engineering",
    review:
      "I recently completed a course on CodeSchool.lk with Pasindu Sampath, where I learned Java basics, OOP, MySQL databases, Spring Boot, and JavaScript. His teaching method is exceptional! He simplifies even the most challenging topics, making them engaging and easy to grasp for beginners while still insightful for those with prior knowledge. Thanks to his practical approach and clear explanations, I now feel confident applying these skills in real-world scenarios. For anyone looking to enhance their programming abilities, I highly recommend CodeSchool.lk and Pasindu Sampath's courses without hesitation!",
    linkedin: "https://www.linkedin.com/in/warundev",
    website: "https://warundev.netlify.app/",
    initials: "WL",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    name: "Malindu Sakuntha",
    university: "University of Jaffna, Java Institute",
    role: "Undergraduate",
    degree: "Freelance Software Developer",
    review:
      "I recently done some course work with Pasindu. Springboot and React are the courses that I am done with CodeSchool and Pasindu. Pasindu is a very humble and talented guy I ever see. His explanation and learning methods are on another level. Also, he pays more attention on students under him. He finds paths and future trends for his students. I am good to say that he is my senior software engineer. He is a role model for many students. So, I recommend this man who empowered me to another level, to carry on your job to the next level.",
    linkedin: "https://www.linkedin.com/in/malindu-sakuntha-3b1979337",
    initials: "MS",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    name: "Sanjaya Perera",
    university: "University of Westminster (IIT)",
    role: "Undergraduate",
    degree: "BSc (Hons) Computer Science",
    review:
      "I recently completed a course on CodeSchool.lk led by Pasindu Sampath, focusing on Java fundamentals, Spring Boot, MySQL databases, and JavaScript. His teaching approach is truly remarkable! He has a unique ability to simplify even the most complex concepts, making them easy to understand for beginners while offering deep insights for those with prior experience. His practical examples and engaging explanations have significantly boosted my confidence in applying these technologies to real-world projects. I highly recommend Pasindu Sampath's courses on CodeSchool.lk to anyone eager to enhance their programming knowledge and skills!",
    linkedin: "https://www.linkedin.com/in/sanjaya-perera-1299b82b9",
    initials: "SP",
    gradient: "from-sky-500 to-indigo-600",
  },
];

/* ─────────────────────────────────────────────
   Testimonial Card
   ───────────────────────────────────────────── */

function TestimonialCard({
  testimonial,
  index,
  isInView,
}: {
  testimonial: (typeof TESTIMONIALS)[0];
  index: number;
  isInView: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = testimonial.review.length > 220;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        delay: 0.2 + index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      }}
      className="group relative flex flex-col p-5 md:p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
    >
      {/* Quote icon */}
      <Quote
        size={24}
        className="text-cyan-500/30 mb-3 flex-shrink-0"
      />

      {/* Review text */}
      <p
        className={`text-gray-400 text-sm leading-relaxed mb-5 flex-1 ${
          !expanded && isLong ? "line-clamp-4" : ""
        }`}
      >
        {testimonial.review}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-cyan-400 text-xs font-medium mb-4 self-start hover:text-cyan-300 transition-colors"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mb-4" />

      {/* Person info */}
      <div className="flex items-center gap-3">
        {/* Avatar with initials */}
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg`}
        >
          {testimonial.initials}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate">
            {testimonial.name}
          </h4>
          <p className="text-[11px] text-gray-500 truncate">
            {testimonial.degree} · {testimonial.university}
          </p>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={testimonial.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-cyan-400 transition-colors duration-200"
            aria-label={`${testimonial.name} LinkedIn`}
          >
            <Linkedin size={15} />
          </a>
          {testimonial.website && (
            <a
              href={testimonial.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-cyan-400 transition-colors duration-200"
              aria-label={`${testimonial.name} website`}
            >
              <Globe size={15} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
   ───────────────────────────────────────────── */

const CONTENT_TRAITS = [
  {
    emoji: "🤡",
    title: "Acting Dumb",
    description: "Sometimes the best comedy comes from pretending you have no idea what's going on.",
    Icon: Drama,
    gradient: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
    hoverGradient: "group-hover:from-amber-500/40 group-hover:to-orange-500/40",
  },
  {
    emoji: "😂",
    title: "Meme Lord",
    description: "Turning everyday dev struggles into memes that hit different at 3 AM.",
    Icon: Smile,
    gradient: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    hoverGradient: "group-hover:from-emerald-500/40 group-hover:to-teal-500/40",
  },
  {
    emoji: "😏",
    title: "Sarcasm Expert",
    description: "Fluent in sarcasm. It's basically my second programming language.",
    Icon: MessageCircleHeart,
    gradient: "from-sky-500/20 to-blue-500/20",
    borderColor: "border-sky-500/30",
    iconColor: "text-sky-400",
    hoverGradient: "group-hover:from-sky-500/40 group-hover:to-blue-500/40",
  },
  {
    emoji: "✨",
    title: "Making People Smile",
    description: "The real goal. If my content made you smile even once — mission accomplished.",
    Icon: Sparkles,
    gradient: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/30",
    iconColor: "text-pink-400",
    hoverGradient: "group-hover:from-pink-500/40 group-hover:to-rose-500/40",
  },
];

export default function Home() {
  const time = useLifeCounter();
  const journeyRef = useRef<HTMLDivElement>(null);
  const journeyInView = useInView(journeyRef, { once: true, margin: "-80px" });
  const beyondRef = useRef<HTMLDivElement>(null);
  const beyondInView = useInView(beyondRef, { once: true, margin: "-80px" });
  const reviewsRef = useRef<HTMLDivElement>(null);
  const reviewsInView = useInView(reviewsRef, { once: true, margin: "-80px" });

  return (
    <div className="relative bg-black -mx-4 -my-8">
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative flex flex-col items-center justify-center min-h-[92vh] text-center overflow-hidden px-4">
        {/* Animated background */}
        <div className="absolute inset-0 z-0">
          <StarsBackground />
          <ShootingStars />
        </div>

        {/* Ambient gradient orbs */}
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 -right-40 w-80 h-80 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 space-y-8 max-w-4xl">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-400 text-sm font-medium tracking-wide"
          >
            Software Engineer
          </motion.span>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white"
          >
            I have{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
              survived
            </span>
          </motion.h1>

          {/* Counter grid */}
          {time ? (
            <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
              <CounterCard value={time.years} label="Years" delay={0.1} />
              <CounterCard value={time.months} label="Months" delay={0.15} />
              <CounterCard value={time.days} label="Days" delay={0.2} />
              <CounterCard value={time.hours} label="Hours" delay={0.25} />
              <CounterCard value={time.minutes} label="Minutes" delay={0.3} />
              <CounterCard value={time.seconds} label="Seconds" delay={0.35} />
            </div>
          ) : (
            /* Placeholder to prevent layout shift during SSR hydration */
            <div className="h-[88px] md:h-[104px]" />
          )}

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 text-base md:text-lg flex items-center justify-center gap-2.5"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
            ...on this beautiful planet
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-2"
          >
            <Link
              href="/projects"
              className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors"
            >
              View Projects <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex justify-center items-center gap-2 px-6 py-3 border border-white/20 bg-white/5 text-white hover:bg-white/10 font-medium rounded-full transition-colors"
            >
              Contact Me
            </Link>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-6 pt-2"
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-white transition-colors duration-300"
            >
              <Github size={22} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-white transition-colors duration-300"
            >
              <Linkedin size={22} />
            </a>
            <a
              href="mailto:hello@example.com"
              className="text-gray-600 hover:text-white transition-colors duration-300"
            >
              <Mail size={22} />
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-2 rounded-full bg-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ JOURNEY SECTION ═══════════════ */}
      <section className="relative py-20 md:py-28 px-4">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/8 rounded-full blur-[180px] pointer-events-none" />

        {/* Section header */}
        <div ref={journeyRef} className="max-w-3xl mx-auto mb-14 md:mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={journeyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-400 text-sm font-medium tracking-wide mb-5"
          >
            The Path So Far
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={journeyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-white"
          >
            My Journey
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative max-w-2xl mx-auto">
          {/* Vertical gradient line */}
          <div className="absolute left-[21px] md:left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-purple-500/20 to-transparent" />

          {MILESTONES.map((milestone, index) => (
            <Milestone
              key={milestone.date}
              milestone={milestone}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════ BEYOND THE CODE SECTION ═══════════════ */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-1/4 -right-40 w-80 h-80 bg-amber-500/8 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-pink-500/8 rounded-full blur-[160px] pointer-events-none" />

        {/* Section header */}
        <div ref={beyondRef} className="max-w-3xl mx-auto mb-14 md:mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={beyondInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 text-sm font-medium tracking-wide mb-5"
          >
            Beyond the Code
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={beyondInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            I also make people{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400">
              smile
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={beyondInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            When I&apos;m not wrestling with source code, I create content that gives people a break from the chaos. Think of it as{" "}
            <span className="text-gray-300 italic">ctrl+z for your stress</span>.
          </motion.p>
        </div>

        {/* Content trait cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 max-w-3xl mx-auto">
          {CONTENT_TRAITS.map((trait, index) => {
            const TraitIcon = trait.Icon;
            return (
              <motion.div
                key={trait.title}
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                animate={beyondInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  delay: 0.3 + index * 0.1,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="group relative p-5 md:p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 cursor-default"
              >
                {/* Icon circle */}
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-br ${trait.gradient} border ${trait.borderColor} flex items-center justify-center mb-4 ${trait.hoverGradient} transition-all duration-300 shadow-lg`}
                >
                  <TraitIcon size={18} className={trait.iconColor} />
                </div>

                {/* Title with emoji */}
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <span>{trait.emoji}</span>
                  {trait.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {trait.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Fun quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={beyondInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="max-w-2xl mx-auto mt-12 md:mt-16 text-center"
        >
          <blockquote className="text-gray-500 text-sm md:text-base italic border-l-2 border-amber-500/30 pl-4 py-1 inline-block text-left">
            &quot;I write code that works (eventually), and content that makes people forget their code doesn&apos;t.&quot;
          </blockquote>
        </motion.div>
      </section>

      {/* ═══════════════ TESTIMONIALS SECTION ═══════════════ */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-cyan-500/8 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-teal-500/6 rounded-full blur-[160px] pointer-events-none" />

        {/* Section header */}
        <div ref={reviewsRef} className="max-w-5xl mx-auto mb-14 md:mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={reviewsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-sm font-medium tracking-wide mb-5"
          >
            What Students Say
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={reviewsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Trusted by{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400">
              learners
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={reviewsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Real feedback from students I&apos;ve mentored through{" "}
            <span className="text-gray-300 font-medium">CodeSchool.lk</span>
          </motion.p>
        </div>

        {/* Testimonial cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={index}
              isInView={reviewsInView}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

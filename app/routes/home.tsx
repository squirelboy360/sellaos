import type { Route } from "./+types/home";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import confetti from "canvas-confetti";
import { Switch } from "~/components/ui/switch";


export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [score, setScore] = useState(0);
  const [ballPos, setBallPos] = useState({ x: 200, y: 200 });
  const [level, setLevel] = useState(1);
  const gameAreaRef = useRef(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleMouseMove = (e) => {
    const rect = gameAreaRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dx = mouseX - ballPos.x;
    const dy = mouseY - ballPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100 - level * 5) {
      const angle = Math.atan2(dy, dx);
      const speed = 25 + level * 7;
      const newX = ballPos.x - Math.cos(angle) * speed;
      const newY = ballPos.y - Math.sin(angle) * speed;

      const clampedX = Math.max(30, Math.min(rect.width - 30, newX));
      const clampedY = Math.max(30, Math.min(rect.height - 30, newY));

      setBallPos({ x: clampedX, y: clampedY });
    }
  };

  const handleClick = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    setScore((prevScore) => {
      const newScore = prevScore + 1;
      if (newScore % 3 === 0) {
        setLevel((prevLevel) => prevLevel + 1);
      }
      return newScore;
    });
    // Move ball instantly on click to keep challenge
    const rect = gameAreaRef.current.getBoundingClientRect();
    const randomX = Math.random() * (rect.width - 60) + 30;
    const randomY = Math.random() * (rect.height - 60) + 30;
    setBallPos({ x: randomX, y: randomY });
  };

  useEffect(() => {
    const area = gameAreaRef.current;
    if (area) {
      area.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (area) {
        area.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [ballPos, level]);

  return (
    <div
      ref={gameAreaRef}
      className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 relative overflow-hidden ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Sun className={darkMode ? "text-gray-400" : "text-yellow-500"} />
        <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
        <Moon className={darkMode ? "text-blue-400" : "text-gray-400"} />
      </div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-6xl font-bold text-center mb-8"
      >
        SellaOS has been discontinued.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-center max-w-xl text-lg mb-12"
      >
        The project has been sold and will no longer be continued. All rights are still reserved by the original creators.
      </motion.p>

      <motion.div
        style={{ top: ballPos.y, left: ballPos.x }}
        className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 flex items-center justify-center shadow-lg cursor-pointer"
        onClick={handleClick}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <p className="font-bold">🎉</p>
      </motion.div>

      <div className="mt-10 text-center">
        <p className="text-lg font-semibold">Score: {score}</p>
        <p className="text-sm opacity-70">Level: {level}</p>
        <p className="mt-2 text-xs opacity-50">Catch the ball — it moves faster and dodges more each level!</p>
      </div>
    </div>
  );
}

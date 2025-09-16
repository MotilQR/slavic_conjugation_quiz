'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from "@supabase/supabase-js";
import en from "@/app/locales/en.json"
import './globals.css';

const WORDS = {
  4: 'стол',
  5: 'океан',
  6: 'письмо',
};
const MAX_ATTEMPTS = 6;

export default function Home() {
  const [wordLength, setWordLength] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [revealed, setRevealed] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [wordLang, setWordLang] = useState(null);
  const l = en;

  const supabaseUrlRu = "https://qvtjiinmoosyootzrjhs.supabase.co";
  const supabaseKeyRu = "sb_publishable_R41KZwttRTglv0d1Z6L0Eg_-eWIrqmk";
  const supabaseRu = createClient(supabaseUrlRu, supabaseKeyRu);

  const supabaseUrlPl = "https://nwdkssafheeqfofajdtr.supabase.co";
  const supabaseKeyPl = "sb_publishable_JfMigoy6ai_V2yWD4a-grQ_ZSW_LoQj";
  const supabasePl = createClient(supabaseUrlPl, supabaseKeyPl);

  const fetchWord = async (length) => {
    let base;
    switch (wordLang) {
      case "ru":
        base = supabaseRu;
        break;
      case "pl":
        base = supabasePl;
        break;
    }
    setWordLength(length)
    setLoading(true);
    let ans = null;
    while (ans == null) {
      const minId = Math.floor(Math.random() * (394250 + 1));
      const { data, error } = await base
          .from("lemmas")
          .select("id, lemma")
          .gt("id", minId)
      const dataF = data.filter(item => item.lemma.length === length);
      const randId = Math.floor(Math.random() * (dataF.length + 1));
      ans = dataF[randId] ? dataF[randId].lemma : null;
    }
    console.log(ans)
    setAnswer(String(ans.toLowerCase()));
    setLoading(false);
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (!wordLength || isGameOver) return;
      const allowed = /^[a-zA-Zа-яёąćęłńóśżźĄĆĘŁŃÓŚŻŹ]$/i;

      if (e.key === 'Enter') {
        if (currentGuess.length === wordLength) revealGuess(currentGuess);
      } else if (e.key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0, -1));
      } else if (allowed.test(e.key)) {
        if (currentGuess.length < wordLength) setCurrentGuess(currentGuess + e.key.toLowerCase());
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentGuess, guesses, wordLength, isGameOver]);

  const revealGuess = (guess) => {
    setGuesses((prev) => [...prev, guess]);

    const answerLetterCount = {};
    for (let char of answer) answerLetterCount[char] = (answerLetterCount[char] || 0) + 1;

    const revealInfo = guess.split('').map((char, idx) => {
      console.log(answer[idx])
      console.log(char)
      console.log(char == answer[idx])
      if (char == answer[idx]) {
        answerLetterCount[char]--;
        return 'correct';
      }
      return null;
    }).map((status, idx) => {
      if (!status) {
        const char = guess[idx];
        if (answer.includes(char) && answerLetterCount[char] > 0) {
          answerLetterCount[char]--;
          return 'semi-correct';
        }
        return 'incorrect';
      }
      return status;
    });

    setRevealed((prev) => [...prev, revealInfo]);
    setCurrentGuess('');

    // Показываем сообщение после завершения анимации
    const totalAnimationTime = guess.length * 0.15 * 1000 + 600; // задержка на букву + длительность переворота
    setTimeout(() => {
      if (guess === answer) {
        setMessage(l.wordle.win);
        setIsGameOver(true);
      } else if (guesses.length + 1 >= MAX_ATTEMPTS) {
        setMessage(l.wordle.lose + answer);
        setIsGameOver(true);
      }
    }, totalAnimationTime);
  };
  

    const resetGame = () => {
        setAnswer(fetchWord(wordLength))
        setGuesses([]);
        setCurrentGuess('');
        setRevealed([]);
        setIsGameOver(false);
        setMessage('');
    };

  const getCellColor = (row, col) => {
    if (!revealed[row]) return 'bg-gray-300';
    const status = revealed[row][col];
    if (status === 'correct') return 'bg-green-500 text-white';
    if (status === 'semi-correct') return 'bg-yellow-400 text-white';
    return 'bg-gray-700 text-white';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D101C] text-white">
        <h1>Loading...</h1>
      </div>
    )
  }

  if (!wordLang) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0D101C]">
        <h1 className="text-2xl mb-6 justify-center text-white">{l.wordle.title}</h1>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-[#DB2B39] hover:bg-[#AE1E2A] transition text-white rounded"
            onClick={() => setWordLang("ru")}
          >
            {l.homePage.russian}
          </button>
          <button
            className="px-4 py-2 bg-[#DB2B39] hover:bg-[#AE1E2A] transition text-white rounded"
            onClick={() => setWordLang("pl")}
          >
            {l.homePage.polish}
          </button>
        </div>
      </div>
    );
  }

  if (!wordLength && wordLang) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0D101C]">
        <h1 className="text-2xl mb-6 justify-center text-white">{l.wordle.title}</h1>
        <div className="flex gap-4">
          {[4, 5, 6].map(len => (
            <button
              key={len}
              onClick={() => fetchWord(len)}
              className="px-4 py-2 bg-[#DB2B39] hover:bg-[#AE1E2A] transition text-white rounded"
            >
              {len} {l.wordle.let}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D101C] p-4">

      <div className="grid gap-2 mb-4">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => {
          const guess = guesses[rowIndex] || (rowIndex === guesses.length ? currentGuess : '');
          const isRevealedRow = revealed[rowIndex] !== undefined;

          return (
            <div key={rowIndex} className="flex gap-2 justify-center">
              {Array.from({ length: wordLength }).map((_, colIndex) => {
                const letter = guess[colIndex] || '';
                const colorClass = getCellColor(rowIndex, colIndex);

                return (
                  <div key={colIndex} className="w-12 h-12 perspective">
                    <motion.div
                      className="relative w-full h-full transform-style-preserve-3d"
                      animate={{ rotateX: isRevealedRow ? 180 : 0 }}
                      transition={{ duration: 0.6, delay: colIndex * 0.15 }}
                    >
                      {/* front */}
                      <div className="absolute w-full h-full backface-hidden flex items-center justify-center border-2 border-gray-400 bg-gray-300 font-bold text-lg">
                        {letter.toUpperCase()}
                      </div>
                      {/* back */}
                      <div className={`absolute w-full h-full backface-hidden rotateX-180 flex items-center justify-center border-2 border-gray-400 font-bold text-lg ${colorClass}`}>
                        {letter.toUpperCase()}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Показываем сообщение после анимации */}
      {message && (
        <div className="mt-4 flex flex-col items-center">
          <p className="text-xl text-white mb-2">{message}</p>
          <div className="flex gap-4">
            <button
                onClick={resetGame}
                className="px-4 py-2 bg-[#DB2B39] hover:bg-[#AE1E2A] transition text-white rounded"
            >
                {l.wordle.retry}
            </button>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#DB2B39] hover:bg-[#AE1E2A] transition text-white rounded"
            >
                {l.wordle.back}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

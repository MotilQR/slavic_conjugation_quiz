"use client";
import en from "@/app/locales/en.json";
import Link from "next/link";
import { useState } from "react";

// const languages = [
//   { code: "ru", label: "Русский" },
//   { code: "en", label: "English" },
//   { code: "cs", label: "Čeština" },
// ];

export default function Header() {
  const [l, setLang] = useState(en);
  const [currentLang, setCurrentLang] = useState("en");

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-[#F4E3B2] backdrop-blur-md shadow-md">
      <h1 className="text-xl font-bold text-[#29335C]">{l.header.title}</h1>
      <nav className="flex gap-4">
        <Link href={`/?lang=${currentLang}`} className="text-[#29335C] hover:text-[#0D101C] hover:underline">{l.header.home}</Link>
        <Link href={`/about?lang=${currentLang}`} className="text-[#29335C] hover:text-[#0D101C] hover:underline">{l.header.about}</Link>
        <Link href={`/game?lang=${currentLang}`} className="text-[#29335C] hover:text-[#0D101C] hover:underline">{l.header.game}</Link>
        {/* <select
          value={currentLang}
          onChange={(e) => changeLanguage(e.target.value)}
          className="border rounded p-1 bg-[#DB2B39] text-white"
        >
          {languages.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select> */}
      </nav>
    </header>
  );
}

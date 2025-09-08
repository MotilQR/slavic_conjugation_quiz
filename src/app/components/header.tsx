"use client";
import en from "@/app/locales/en.json";
import ru from "@/app/locales/ru.json"
import cs from "@/app/locales/en.json"
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

const languages = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "cs", label: "Čeština" },
];

export default function Header() {
  const [l, setLang] = useState(en);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentLang, setCurrentLang] = useState("en");

  const changeLanguage = (lang: string) => {
    /*const params = new URLSearchParams(searchParams);
    params.set("lang", lang);
    router.push(`${pathname}?${params.toString()}`);*/
    setCurrentLang(lang);
    switch (String(lang)) {
      case "ru":
        console.log(l);
        setLang(ru);
        break;
      case "cs":
        setLang(cs);
        break;
      default:
        setLang(en)
        break;
    }
    router.refresh();
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-[#F4E3B2] backdrop-blur-md shadow-md">
      <h1 className="text-xl font-bold text-[#29335C]">{l.header.title}</h1>
      <nav className="flex gap-4">
        <Link href={`/?lang=${currentLang}`} className="text-[#29335C] hover:text-[#0D101C] hover:underline">{l.header.home}</Link>
        <Link href={`/about?lang=${currentLang}`} className="text-[#29335C] hover:text-[#0D101C] hover:underline">{l.header.about}</Link>
        <select
          value={currentLang}
          onChange={(e) => changeLanguage(e.target.value)}
          className="border rounded p-1 bg-[#DB2B39] text-white"
        >
          {languages.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </nav>
    </header>
  );
}

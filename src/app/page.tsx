"use client";
import en from "@/app/locales/en.json"
import ru from "@/app/locales/ru.json"
import cs from "@/app/locales/en.json"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ReadonlyURLSearchParams } from "next/navigation";

// app/page.tsx
export default function Home() {
  const [lang, setLang] = useState(en);
  const router = useRouter();

  /* useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const l = params.get("lang");
        switch (String(l)) {
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
  }, [])*/

  return (
    <div className="min-h-screen bg-[#0D101C] text-white">
      <main className="flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-4xl font-extrabold mb-4">{lang.homePage.title}</h2>
        <p className="text-lg mb-8">{lang.homePage.subtitle}</p>

        <div className="grid grid-cols-2 gap-4">
          <button className="px-6 py-3 bg-[#DB2B39] text-white rounded-xl shadow hover:bg-[#AE1E2A] transition"
                  onClick={() => {router.push("/rus")}}>
            {lang.homePage.russian}
          </button>
          <button className="px-6 py-3 bg-[#DB2B39] text-white rounded-xl shadow hover:bg-[#AE1E2A] transition">
            {lang.homePage.czech}
          </button>
          <button className="px-6 py-3 bg-[#DB2B39] text-white rounded-xl shadow hover:bg-[#AE1E2A] transition">
            {lang.homePage.ukranian}
          </button>
          <button className="px-6 py-3 bg-[#DB2B39] text-white rounded-xl shadow hover:bg-[#AE1E2A] transition">
            {lang.homePage.polish}
          </button>
        </div>
      </main>
    </div>
  );
}


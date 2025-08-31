"use client";
import en from "@/app/locales/en.json"
import { useRouter } from "next/navigation";

// app/page.tsx
export default function Home() {
  const l = en;
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0D101C] text-white">
      <main className="flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-4xl font-extrabold mb-4">{l.homePage.title}</h2>
        <p className="text-lg mb-8">{l.homePage.subtitle}</p>

        <div className="grid grid-cols-2 gap-4">
          <button className="px-6 py-3 bg-[#DB2B39] text-white rounded-xl shadow hover:bg-[#AE1E2A] transition"
                  onClick={() => {router.push("/rus")}}>
            {l.homePage.russian}
          </button>
          <button className="px-6 py-3 bg-[#DB2B39] text-white rounded-xl shadow hover:bg-[#AE1E2A] transition">
            {l.homePage.czech}
          </button>
          <button className="px-6 py-3 bg-[#DB2B39] text-white rounded-xl shadow hover:bg-[#AE1E2A] transition">
            {l.homePage.ukranian}
          </button>
          <button className="px-6 py-3 bg-[#DB2B39] text-white rounded-xl shadow hover:bg-[#AE1E2A] transition">
            {l.homePage.polish}
          </button>
        </div>
      </main>
    </div>
  );
}


import en from "@/app/locales/en.json";
import Link from "next/link";

export default function Header() {
  const l = en;

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-[#F4E3B2] backdrop-blur-md shadow-md">
      <h1 className="text-xl font-bold text-[#29335C]">{l.header.title}</h1>
      <nav className="flex gap-4">
        <Link href={"/"} className="text-[#29335C] hover:text-[#0D101C] hover:underline">{l.header.home}</Link>
        <Link href={"/about"} className="text-[#29335C] hover:text-[#0D101C] hover:underline">{l.header.about}</Link>
      </nav>
    </header>
  );
}

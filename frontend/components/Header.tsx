import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { text: "Pump.fun", url: "#" },
  { text: "DexScreener", url: "#" },
  { text: "Telegram", url: "#" },
  { text: "X", url: "#" },
];

export function Header() {
  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between md:px-16 gap-8">
      <Link href={"/"}>
        <Image src="/logo.png" width={300} height={300} alt="Home" />
      </Link>

      <nav
        className={`grid grid-cols-2 md:flex gap-4 items-center text-xs tracking-widest`}
      >
        {navLinks.map((link, key) => (
          <Link
            className="border border-neutral-200 border-solid bg-neutral-800 text-center w-32 py-1 font-bold"
            key={key}
            href={link.url}
          >
            {link.text}
          </Link>
        ))}
      </nav>
    </header>
  );
}

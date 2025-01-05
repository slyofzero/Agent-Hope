import { useDefaultTokenInfoAtom } from "@/stats/defaultInfo";
import { ITokenInfo, TokenInfoApiRes, TokenInfoJobApiRes } from "@/types/info";
import { TerminalPool } from "@/types/terminal";
import { apiFetcher } from "@/utils/api";
import { sleep } from "@/utils/time";
import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Scanning } from "../Scanning";
import Link from "next/link";
import { FaBars } from "react-icons/fa";

const navLinks = [
  { text: "Pump.fun", url: "#" },
  { text: "DexScreener", url: "#" },
  { text: "Telegram", url: "#" },
  { text: "X", url: "#" },
];

export function Home() {
  const router = useRouter();
  const { setDefaultTokenInfo } = useDefaultTokenInfoAtom();
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const getTokenInfo = async (e: FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setError("");

    const token = (e.target as HTMLFormElement).token.value;

    const tokenData = await apiFetcher<TerminalPool>(
      `https://api.geckoterminal.com/api/v2/networks/solana/tokens/${token}/pools?page=1`
    );
    if (!tokenData || !tokenData?.data?.data?.length) {
      setError("No pools found for this token");
      setIsScanning(false);
      return;
    }

    const res = await apiFetcher<TokenInfoApiRes>(`/api/token/${token}`); // prettier-ignore
    if (res?.data) {
      const jobId = res.data.jobId;
      await sleep(5000);

      for (let i = 0; i < 20; i++) {
        const jobRes = await apiFetcher<TokenInfoJobApiRes>(
          `/api/job/${jobId}`
        );

        if (jobRes?.data.status !== "pending") {
          setDefaultTokenInfo(jobRes?.data.data as ITokenInfo);
          router.push("/scan");
          break;
        }

        await sleep(5000);
      }
    } else setDefaultTokenInfo(null);
  };

  return isScanning ? (
    <Scanning />
  ) : (
    <main className="flex flex-col gap-8 items-center p-8 h-screen overflow-hidden bg-gradient-to-b from-background to-black">
      <div className="w-full flex items-center justify-between md:px-32">
        <Image src="/logo.png" width={30} height={30} alt="Home" />

        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>

        <nav
          className={`${
            menuOpen
              ? "flex flex-col absolute top-12 right-16 bg-background p-2"
              : "hidden"
          } md:flex gap-4 items-center text-xs tracking-widest`}
        >
          {navLinks.map((link, key) => (
            <Link
              className="border border-neutral-200 border-solid bg-neutral-800 text-center w-32 py-1"
              key={key}
              href={link.url}
            >
              {link.text}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-col flex-grow items-center justify-center gap-8 relative">
        <Image
          src={"/agent_hope.png"}
          height={800}
          width={800}
          alt="hope"
          className="border-2 border-solid border-white/75 shadow-white shadow-md fade-bottom"
        />

        <div className="tracking-widest flex flex-col gap-8 items-center text-center relative md:-top-20">
          <div className="text-xs md:text-base flex flex-col gap-4 md:w-[500px]">
            <h1>
              Welcome to hope-tech. I&apos;m Hope, your data analytic agent for
              solana contracts.
            </h1>
            <h1>
              {error ? (
                <span className="text-red-400">{error}</span>
              ) : (
                <>Please key in the address to start:</>
              )}
            </h1>
          </div>

          <form
            className="flex flex-col md:flex-row items-center gap-4"
            onSubmit={getTokenInfo}
          >
            <input
              name="token"
              type="text"
              placeholder="Type here..."
              className="border border-white border-solid text-sm bg-black p-2 px-4 w-72 md:w-[700px] text-white outline-none"
            />

            <button
              type="submit"
              className="bg-green-500 text-whie px-8 py-1 text-sm"
            >
              scan
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

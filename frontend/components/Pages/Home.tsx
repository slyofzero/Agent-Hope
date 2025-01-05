import { useDefaultTokenInfoAtom } from "@/states/defaultInfo";
import { ITokenInfo, TokenInfoApiRes, TokenInfoJobApiRes } from "@/types/info";
import { apiFetcher } from "@/utils/api";
import { sleep } from "@/utils/time";
import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Scanning } from "../Scanning";
import { Header } from "../Header";
import { PairData } from "@/types/pair";

export function Home() {
  const router = useRouter();
  const { setDefaultTokenInfo } = useDefaultTokenInfoAtom();
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getTokenInfo = async (e: FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setError("");

    const token = (e.target as HTMLFormElement).token.value;

    const tokenPoolsData = await apiFetcher<PairData>(
      `https://api.dexscreener.com/latest/dex/tokens/${token}`
    );
    const tokenData = tokenPoolsData?.data?.pairs?.at(0);
    if (!tokenData) {
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
          const tokenInfo = jobRes?.data.data as ITokenInfo;
          setDefaultTokenInfo({ tokenData, tokenInfo });
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
      <Header />

      <div className="flex flex-col flex-grow items-center justify-center gap-8 relative">
        <Image
          src={"/agent_hope.png"}
          height={800}
          width={800}
          alt="hope"
          className="border-2 border-solid border-white/75 shadow-white shadow-md fade-bottom"
        />

        <div className="tracking-widest flex flex-col gap-8 items-center text-center relative md:-top-20">
          <div className="text-xs md:text-base font-medium flex flex-col gap-4 md:w-[500px]">
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

import { FormEvent, useState } from "react";
import { apiFetcher } from "@/utils/api";
import { ITokenInfo, TokenInfoApiRes, TokenInfoJobApiRes } from "@/types/info";
import { sleep } from "@/utils/time";
import { TokenInfo } from "@/components/TokenInfo";
import { Courier_Prime } from "next/font/google";
import { useDefaultTokenInfoAtom } from "@/stats/defaultInfo";
import { TerminalPool } from "@/types/terminal";
import Link from "next/link";
import Image from "next/image";

const courier = Courier_Prime({
  weight: "400",
  subsets: ["latin"],
});

export default function AnalysisPage() {
  const { defaultTokenInfo } = useDefaultTokenInfoAtom();
  const [tokenInfo, setTokenInfo] = useState<ITokenInfo | null>(defaultTokenInfo); // prettier-ignore
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getTokenInfo = async (e: FormEvent) => {
    e.preventDefault();
    const token = (e.target as HTMLFormElement).token.value;

    const tokenData = await apiFetcher<TerminalPool>(
      `https://api.geckoterminal.com/api/v2/networks/solana/tokens/${token}/pools?page=1`
    );
    if (!tokenData || !tokenData?.data?.data?.length) {
      setError("No pools found for this token");
      return;
    }

    setIsLoading(true);
    setError("");

    const res = await apiFetcher<TokenInfoApiRes>(`/api/token/${token}`); // prettier-ignore
    if (res?.data) {
      const jobId = res.data.jobId;
      await sleep(5000);

      for (let i = 0; i < 20; i++) {
        const jobRes = await apiFetcher<TokenInfoJobApiRes>(
          `/api/job/${jobId}`
        );

        if (jobRes?.data.status !== "pending") {
          setTokenInfo(jobRes?.data.data as ITokenInfo);
          break;
        }

        await sleep(5000);
      }
    } else setTokenInfo(null);
    setIsLoading(false);
  };

  console.log(JSON.stringify(tokenInfo));

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 gap-8 mt-4 md:mt-16 mb-16 ${courier.className}`}
    >
      <div className="flex flex-col gap-8 md:flex-row items-center justify-between w-full px-32">
        <Link href={"/"} className="text-2xl font-bold">
          <Image src="/logo.png" width={30} height={30} alt="Home" />
        </Link>

        <form
          className="flex flex-col md:flex-row items-center gap-4"
          onSubmit={getTokenInfo}
        >
          <input
            name="token"
            type="text"
            className="border border-white border-solid text-sm rounded-md bg-black p-2 w-72 md:w-96 h-12 text-white outline-none"
          />

          <button type="submit" className="bg-white text-black px-2 py-1">
            scan
          </button>
        </form>
      </div>

      {isLoading ? (
        <p>scanning...</p>
      ) : error ? (
        <span className="text-red-400">{error}</span>
      ) : (
        tokenInfo && <TokenInfo data={tokenInfo} />
      )}
    </div>
  );
}

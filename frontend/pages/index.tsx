import { useDefaultTokenInfoAtom } from "@/stats/defaultInfo";
import { ITokenInfo, TokenInfoApiRes, TokenInfoJobApiRes } from "@/types/info";
import { TerminalPool } from "@/types/terminal";
import { apiFetcher } from "@/utils/api";
import { sleep } from "@/utils/time";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { ReactTyped } from "react-typed";

export default function HomePage() {
  const router = useRouter();
  const { setDefaultTokenInfo } = useDefaultTokenInfoAtom();
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
          setDefaultTokenInfo(jobRes?.data.data as ITokenInfo);
          router.push("/scan");
          break;
        }

        await sleep(5000);
      }
    } else setDefaultTokenInfo(null);
    setIsLoading(false);
  };

  return (
    <main className="flex flex-col gap-8 items-center justify-center h-screen w-screen">
      <h1 className="text-xl md:text-3xl tracking-widest md:w-[520px] text-center">
        {isLoading ? (
          <>scaning...</>
        ) : error ? (
          <span className="text-red-400">{error}</span>
        ) : (
          <ReactTyped
            strings={["To start, please key in the contract address to scan."]}
            showCursor={true}
            typeSpeed={50}
          />
        )}
      </h1>

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
    </main>
  );
}

import { FormEvent, useState } from "react";
import { apiFetcher } from "@/utils/api";
import { ITokenInfo, TokenInfoApiRes, TokenInfoJobApiRes } from "@/types/info";
import { sleep } from "@/utils/time";
import { TokenInfo } from "@/components/TokenInfo";

export default function Home() {
  const [tokenInfo, setTokenInfo] = useState<ITokenInfo | null>(); // prettier-ignore
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getTokenInfo = async (e: FormEvent) => {
    e.preventDefault();
    const token = (e.target as HTMLFormElement).token.value;
    setIsLoading(true);
    const res = await apiFetcher<TokenInfoApiRes>(`/api/token/${token}`); // prettier-ignore
    if (res?.data) {
      const jobId = res.data.jobId;

      for (let i = 0; i < 20; i++) {
        const jobRes = await apiFetcher<TokenInfoJobApiRes>(
          `/api/job/${jobId}`
        );

        if (jobRes?.data.status !== "pending") {
          setTokenInfo(jobRes?.data.data);
          break;
        }

        await sleep(5000);
      }
    } else setTokenInfo(null);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-8 mb-16">
      <form className="flex items-center gap-4" onSubmit={getTokenInfo}>
        <input
          name="token"
          type="text"
          className="border border-white border-solid text-sm rounded-md bg-black p-2 w-96 h-12 text-white outline-none"
        />

        <button type="submit" className="bg-white text-black px-2">
          Get data
        </button>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        tokenInfo && <TokenInfo data={tokenInfo} />
      )}
    </div>
  );
}

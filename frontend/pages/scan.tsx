import { FormEvent, useState } from "react";
import { apiFetcher } from "@/utils/api";
import { ITokenInfo, TokenInfoApiRes, TokenInfoJobApiRes } from "@/types/info";
import { sleep } from "@/utils/time";
import { TokenInfo } from "@/components/TokenInfo";
import { Inconsolata } from "next/font/google";
import { ITokenInfoAtom, useDefaultTokenInfoAtom } from "@/states/defaultInfo";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Scanning } from "@/components/Scanning";
import { PairData } from "@/types/pair";
import Link from "next/link";
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { CiGlobe } from "react-icons/ci";

const courier = Inconsolata({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export default function AnalysisPage() {
  const { defaultTokenInfo } = useDefaultTokenInfoAtom();
  const [tokenInfo, setTokenInfo] = useState<ITokenInfoAtom | null>(defaultTokenInfo); // prettier-ignore
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getTokenInfo = async (e: FormEvent) => {
    e.preventDefault();
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

    setIsScanning(true);
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
          const tokenInfo = jobRes?.data.data as ITokenInfo;
          setTokenInfo({ tokenData, tokenInfo });
          break;
        }

        await sleep(5000);
      }
    } else setTokenInfo(null);
    setIsScanning(false);
  };

  const tokenData = tokenInfo?.tokenData;
  const baseTokenData = tokenData?.baseToken;

  return isScanning ? (
    <Scanning />
  ) : (
    <main
      className={`flex flex-col gap-8 items-center p-8 h-screen ${courier.className}`}
    >
      <Header />

      <div className="flex flex-col gap-16 md:grid md:px-16 grid-cols-12">
        <div className="flex flex-col gap-8 w-full col-span-4">
          <div className="flex flex-col bg-black w-full">
            <h1 className="text-center border border-solid border-white p-2 font-extrabold tracking-widest">
              Agent Hope
            </h1>
            <Image
              src={"/agent_hope_1.png"}
              height={600}
              width={600}
              alt="agent hope"
              className="border border-solid border-white"
            />
            <div
              className={`bg-white px-2 py-1 text-center font-semibold ${
                error ? "text-red-400" : "text-black"
              }`}
            >
              {error
                ? error
                : !baseTokenData
                ? "No token to scan"
                : "Here's the information about this token"}
            </div>
          </div>

          {!error && baseTokenData && (
            <>
              <div className="flex flex-col gap-4">
                <span>
                  Name:{" "}
                  <span className="text-highlight">{baseTokenData?.name}</span>
                </span>
                <span>
                  Ticker:{" "}
                  <span className="text-highlight">
                    {baseTokenData?.symbol}
                  </span>
                </span>
                <span>
                  Contract Address:{" "}
                  <span className="text-highlight">
                    {baseTokenData?.address}
                  </span>
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  ...(tokenData?.info.websites || []),
                  ...(tokenData?.info.socials || []),
                ].map((social, key) => {
                  const text = // @ts-expect-error weird
                    ((social.label || social.type) as string).toLowerCase();
                  const logo =
                    text === "telegram" ? (
                      <FaTelegramPlane />
                    ) : text === "twitter" ? (
                      <FaXTwitter />
                    ) : (
                      <CiGlobe className="font-bold" />
                    );
                  return (
                    <Link
                      className="capitalize w-32 border bg-neutral-800 px-4 border-solid border-white flex items-center gap-2"
                      href={social.url}
                      key={key}
                    >
                      {logo}
                      {text}
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          <div className="flex flex-col gap-4">
            <h3>Would you like to search for any other contracts?</h3>

            <form
              className="flex flex-row items-center gap-4"
              onSubmit={getTokenInfo}
            >
              <input
                name="token"
                type="text"
                placeholder="Type here..."
                className="border border-white border-solid text-sm bg-black p-2 px-4 flex-grow text-white outline-none"
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

        {error ? (
          <span className="text-red-400 col-span-8 text-center">{error}</span>
        ) : (
          tokenInfo && <TokenInfo data={tokenInfo.tokenInfo} />
        )}
      </div>
    </main>
  );
}

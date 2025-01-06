import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import { Header } from "../Header";
import { ReactTyped } from "react-typed";

export function Home() {
  const router = useRouter();

  const getTokenInfo = async (e: FormEvent) => {
    e.preventDefault();
    const token = (e.target as HTMLFormElement).token.value;
    router.push(`/scan?token=${token}`);
  };

  return (
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
              <ReactTyped
                showCursor={false}
                typeSpeed={50}
                strings={[
                  "Welcome to hope-tech. I&apos;m Hope, your data analytic agent for solana contracts.",
                ]}
              />
            </h1>
            <h1>
              <ReactTyped
                showCursor={false}
                typeSpeed={50}
                strings={["Please key in the address to start:"]}
              />
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

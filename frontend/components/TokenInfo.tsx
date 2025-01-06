import { ITokenInfo } from "@/types/info";
import { ReactTyped } from "react-typed";

interface Props {
  data: ITokenInfo;
}

export function TokenInfo({ data }: Props) {
  const keys: (keyof ITokenInfo)[] = [
    "tokenData",
    "marketData",
    "auditData",
    "chartData",
    "engagementData",
  ];

  return (
    <main className={`flex flex-col gap-8 col-span-8`}>
      {keys.map((key: keyof ITokenInfo) => {
        if (!data[key].paragraphs) return null;
        return (
          <section
            key={key}
            className="flex flex-col gap-4 border-2 border-solid border-white p-4 lg:px-8 border-spacing-9"
          >
            <h1 className="text-2xl font-bold text-green-400">
              <ReactTyped
                strings={[data[key].title]}
                typeSpeed={50}
                startWhenVisible
                showCursor={false}
              />
            </h1>
            {data[key].paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-white border-t border-dotted border-white pt-4 leading-7"
              >
                <ReactTyped strings={[p]} startWhenVisible showCursor={false} />
              </p>
            ))}

            {data[key].bulletPoints && (
              <ul className="flex flex-col gap-4 ml-4 md:ml-12 pt-4">
                {data[key].bulletPoints.map((bp, i) => (
                  <li key={i}>
                    <ReactTyped
                      strings={[`${i + 1} - ${bp}`]}
                      startWhenVisible
                      showCursor={false}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </main>
  );
}

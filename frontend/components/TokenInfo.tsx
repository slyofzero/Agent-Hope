import { ITokenInfo } from "@/types/info";

interface Props {
  data: ITokenInfo;
}

export function TokenInfo({ data }: Props) {
  const keys: (keyof ITokenInfo)[] = [
    "marketData",
    "auditData",
    "chartData",
    "engagementData",
  ];

  const highlightNumbers = (text: string) => {
    return text.split(/(\$\d\.+|\d+)/).map((part, index) =>
      /\$\d\.+|\d+/.test(part) ? (
        <span key={index} className="text-yellow-400 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <main className={`flex flex-col gap-8`}>
      {keys.map((key: keyof ITokenInfo) => {
        if (!data[key].paragraphs) return null;
        return (
          <section
            key={key}
            className="flex flex-col gap-4 border border-dotted border-white p-4 lg:px-8 border-spacing-9"
          >
            <h1 className="text-2xl font-bold text-yellow-400">
              {data[key].title}
            </h1>
            {data[key].paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-white md:pr-96 border-t border-dotted border-white pt-4 leading-7"
              >
                {highlightNumbers(p)}
              </p>
            ))}

            {data[key].bulletPoints && (
              <ul className="flex flex-col gap-4 ml-12 pt-4">
                {data[key].bulletPoints.map((bp, i) => (
                  <li key={i}>
                    {highlightNumbers(String(i + 1))} - {bp}
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

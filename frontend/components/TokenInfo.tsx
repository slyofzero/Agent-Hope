import { ITokenInfo } from "@/types/info";

interface Props {
  data: ITokenInfo;
}

const h1Style = "text-2xl font-bold text-white";

export function TokenInfo({ data }: Props) {
  const { marketData, auditData, chartData } = data;

  return (
    <main className={`flex flex-col gap-4`}>
      <section className="flex flex-col gap-4">
        <h1 className={h1Style}>{marketData.title}</h1>

        <div className="flex flex-col gap-2">
          {marketData.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h1 className={h1Style}>{auditData.title}</h1>

        <div className="flex flex-col gap-2">
          {auditData.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h1 className={h1Style}>{chartData.title}</h1>

        <div className="flex flex-col gap-2">
          {chartData.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>
    </main>
  );
}

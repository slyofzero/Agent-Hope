export interface ITokenInfo {
  marketData: {
    title: string;
    paragraphs: string[];
  };
  auditData: {
    title: string;
    paragraphs: string[];
  };
  chartData: {
    title: string;
    paragraphs: string[];
  };
}

export interface TokenInfoApiRes {
  data: ITokenInfo;
  response: number;
}

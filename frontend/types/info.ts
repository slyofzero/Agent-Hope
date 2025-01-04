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
  message: string;
  jobId: string;
}

export interface TokenInfoJobApiRes {
  status: "pending" | "completed" | "rejected";
  data: ITokenInfo;
}

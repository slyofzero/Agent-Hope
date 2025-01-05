export interface ITokenInfo {
  tokenData: {
    title: string;
    paragraphs: string[];
    bulletPoints?: string[];
  };
  marketData: {
    title: string;
    paragraphs: string[];
    bulletPoints?: string[];
  };
  auditData: {
    title: string;
    paragraphs: string[];
    bulletPoints: string[];
  };
  chartData: {
    title: string;
    paragraphs: string[];
    bulletPoints: string[];
  };
  engagementData: {
    title: string;
    paragraphs: string[];
    bulletPoints?: string[];
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

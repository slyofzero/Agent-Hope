import { SwapTxnData } from "@/types";

export const userState: { [key: number]: string } = {};

export interface PortalDataInput {
  link: string;
  media: string;
  text: string;
  channelId: number;
}
export const portalDataInput: { [key: number]: Partial<PortalDataInput> } = {};

export const userSwaps: { [key: string]: SwapTxnData[] } = {};

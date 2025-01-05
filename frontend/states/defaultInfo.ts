import { ITokenInfo } from "@/types/info";
import { Pair } from "@/types/pair";
import { atom, useAtom } from "jotai";

export interface ITokenInfoAtom {
  tokenData: Pair;
  tokenInfo: ITokenInfo;
}

const defaultTokenInfoAtom = atom<ITokenInfoAtom | null>(null);

export function useDefaultTokenInfoAtom() {
  const [defaultTokenInfo, setDefaultTokenInfo] = useAtom(defaultTokenInfoAtom);
  return { defaultTokenInfo, setDefaultTokenInfo };
}

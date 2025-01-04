import { ITokenInfo } from "@/types/info";
import { atom, useAtom } from "jotai";

const defaultTokenInfoAtom = atom<ITokenInfo | null>(null);

export function useDefaultTokenInfoAtom() {
  const [defaultTokenInfo, setDefaultTokenInfo] = useAtom(defaultTokenInfoAtom);
  return { defaultTokenInfo, setDefaultTokenInfo };
}

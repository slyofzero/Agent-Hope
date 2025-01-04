"use client";
import { SCRIPT_URL } from "@/utils/env";
import { FormEvent, useState } from "react";
import { apiFetcher } from "@/utils/api";
import { TokenInfoApiRes } from "@/types/info";

export default function Home() {
  const [] = useState({});
  const getTokenInfo = async (e: FormEvent) => {
    e.preventDefault();
    const token = (e.target as HTMLFormElement).token.value;
    const res = await apiFetcher<TokenInfoApiRes>(`${SCRIPT_URL}/token/${token}`); // prettier-ignore
    console.log(res?.data.data);
  };

  return (
    <div className="flex justify-center p-4">
      <form className="flex items-center gap-4" onSubmit={getTokenInfo}>
        <input
          name="token"
          type="text"
          className="border border-white border-solid text-sm rounded-md bg-black p-2 w-96 h-12 text-white outline-none"
        />

        <button type="submit" className="bg-white text-black px-2">
          Get data
        </button>
      </form>
    </div>
  );
}

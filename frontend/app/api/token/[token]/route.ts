import { TokenInfoApiRes } from "@/types/info";
import { TerminalPool } from "@/types/terminal";
import { apiFetcher } from "@/utils/api";
import { SCRIPT_URL } from "@/utils/env";
import { errorHandler } from "@/utils/handlers";

interface Params {
  token: string;
}

export interface TokenInfoResponse {
  message: string;
  data?: TokenInfoApiRes["data"];
}

export async function GET(req: Request, context: { params: Params }) {
  try {
    const { token } = context.params;
    const tokenData = await apiFetcher<TerminalPool>(
      `https://api.geckoterminal.com/api/v2/networks/eth/tokens/${token}/pools?page=1`
    );

    if (!tokenData || !tokenData.data.data.length)
      return new Response(
        JSON.stringify({ message: "No pools found for this token" }),
        { status: 404 }
      );

    const res = await apiFetcher<TokenInfoApiRes>(`${SCRIPT_URL}/token/${token}`); // prettier-ignore
    if (!res)
      return new Response(
        JSON.stringify({ message: "No info found for this token" }),
        { status: 404 }
      );

    const data = res.data.data;
    return Response.json({ message: "Info fetched successfully", data });
  } catch (error) {
    errorHandler(error);
    return Response.json(
      { message: "Couldn't fetch data for this token" },
      { status: 500 }
    );
  }
}

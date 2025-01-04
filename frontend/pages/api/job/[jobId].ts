import { NextApiRequest, NextApiResponse } from "next";
import { TokenInfoJobApiRes } from "@/types/info";
import { apiFetcher } from "@/utils/api";
import { SCRIPT_URL } from "@/utils/env";
import { errorHandler } from "@/utils/handlers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { jobId } = req.query;

  if (typeof jobId !== "string") {
    res.status(400).json({ message: "Invalid token jobId" });
    return;
  }

  try {
    const jobData = await apiFetcher<TokenInfoJobApiRes>(
      `${SCRIPT_URL}/job/${jobId}`
    );

    res.status(200).json(jobData?.data);
  } catch (error) {
    errorHandler(error);
    res.status(500).json({ message: "Couldn't fetch data for this token" });
  }
}

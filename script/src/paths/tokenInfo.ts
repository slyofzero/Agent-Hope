import { Request, Response } from "express";
import { getAITokenInfo, TokenInfo } from "../utils/audit";
import { nanoid } from "nanoid";
import { scheduledJobs } from "./job";

export async function tokenInfoPath(req: Request, res: Response) {
  const address = req.params.address;
  const jobId = nanoid();
  scheduledJobs[jobId] = { status: "pending" };

  processTokenInfo(address, jobId);

  return res.json({ message: "Job started", jobId });
}

async function processTokenInfo(address: string, jobId: string) {
  let info = await getAITokenInfo(address);

  if (!info) {
    scheduledJobs[jobId] = { status: "failed" };
    return;
  }

  info = info.replace(/```json/, "").replace(/```/, "");
  const jsonData = JSON.parse(info) as TokenInfo;
  scheduledJobs[jobId] = { status: "completed", data: jsonData };
}

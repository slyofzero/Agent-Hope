import { log } from "../utils/handlers";
import { TokenInfo } from "../utils/audit";
import { Request, Response } from "express";

type JobStatus = "pending" | "completed" | "failed" | "not found";
export const scheduledJobs: Record<
  string,
  { status: JobStatus; data?: TokenInfo }
> = {};

export async function getJobStatus(req: Request, res: Response) {
  const jobId = req.params.jobId;
  let jobData = scheduledJobs[jobId];

  if (!jobData) {
    jobData = { status: "not found" };
  }
  log(`Job ${jobId} status - ${jobData.status}`);

  return res.json(jobData);
}

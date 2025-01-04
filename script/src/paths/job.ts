import { TokenInfo } from "@/utils/audit";
import { Request, Response } from "express";

type JobStatus = "pending" | "completed" | "failed";
export const scheduledJobs: Record<
  string,
  { status: JobStatus; data?: TokenInfo }
> = {};

export async function getJobStatus(req: Request, res: Response) {
  const jobId = req.params.jobId;
  const status = scheduledJobs[jobId];
  return res.json(status);
}

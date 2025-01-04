interface MatchData {
  teamA: string;
  teamB: string;
  duration: number;
}

export const matchData: { [key: string]: Partial<MatchData> } = {};

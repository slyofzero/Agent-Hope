import { Loading } from "@/components/Loading";
import { Home } from "@/components/Pages/Home";
import { useState } from "react";

export default function HomePage() {
  const [isWebsiteLoading, setIsWebsiteLoading] = useState<boolean>(true);

  return isWebsiteLoading ? (
    <Loading setVideoEnded={setIsWebsiteLoading} />
  ) : (
    <Home />
  );
}

import { SetStateAction } from "jotai";
import { Dispatch } from "react";

interface Props {
  setVideoEnded: Dispatch<SetStateAction<boolean>>;
}

export function Loading({ setVideoEnded }: Props) {
  const handleVideoEnd = () => {
    setVideoEnded(false);
  };

  return (
    <div className="h-screen w-screen">
      <video
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        onEnded={handleVideoEnd}
        muted
      >
        <source src="/website_loading.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export function Scanning() {
  return (
    <div className="h-full w-full col-span-8">
      <video
        className="h-full w-full object-cover"
        autoPlay
        loop
        playsInline
        muted
      >
        <source src="/scanning.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

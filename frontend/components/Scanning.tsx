export function Scanning() {
  return (
    <div className="h-screen w-screen">
      <video className="w-full h-full object-cover" autoPlay loop>
        <source src="/scanning.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

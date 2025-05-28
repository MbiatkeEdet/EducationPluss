import Image from "next/image";

export default function BackgroundImage() {
  return (
    <div className=" relative h-screen w-full">
      <Image
        src="/robot.jpg"
        alt="Background"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold bg-black/50">
        Overlay Content
      </div>
    </div>
  );
}

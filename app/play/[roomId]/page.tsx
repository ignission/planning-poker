import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Play({ params }: { params: { roomId: string } }) {
  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
      {params.roomId}
    </h1>
  );
}

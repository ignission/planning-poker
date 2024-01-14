import bs58 from "bs58";

export default function Play({ params }: { params: { roomId: string } }) {
  if (!params.roomId) {
    throw new Error("roomId is required");
  }
  const bytes = bs58.decode(params.roomId);
  const decodedKey = new TextDecoder().decode(bytes);

  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
      {decodedKey}
    </h1>
  );
}

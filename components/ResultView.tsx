import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {ref, update} from "firebase/database";
import {useState} from "react";
import {useDatabase} from "reactfire";
import {Room} from "@/lib/model/room";
import {Participant} from "@/lib/model/participant";

interface ResultViewProps {
  roomId:string;
  userId: string;
  participants: Participant[];
}

export function ResultView({ roomId, userId, participants }: ResultViewProps) {
  const db = useDatabase();

  const handleNext = async () => {
    await update(ref(db, `rooms/${roomId}`), {
      finished: false,
    });
  };

  const pointCount: { [key: number]: number } = {};
  [1, 3, 5, 8, 13].forEach((point) => {
    pointCount[point] = 0;
  });
  Object.values(participants).forEach((p) => {
    pointCount[p.point!]++;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Result</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex justify-start gap-4">
            {Array(pointCount[1]).fill(null).map((_, i) => (
              <VoteItem
                key={i}
                color="#FF6347" // ここは各ポイントに対応する色に変更してください
                point={1}
              />
            ))}
          </div>
          <div className="flex justify-start gap-4">
            {Array(pointCount[3]).fill(null).map((_, i) => (
              <VoteItem
                key={i}
                color="#32CD32"
                point={3}
              />
            ))}
          </div>
          <div className="flex justify-start gap-4">
            {Array(pointCount[5]).fill(null).map((_, i) => (
              <VoteItem
                key={i}
                color="#FFD700"
                point={5}
              />
            ))}
          </div>
          <div className="flex justify-start gap-4">
            {Array(pointCount[8]).fill(null).map((_, i) => (
              <VoteItem
                key={i}
                color="#1E90FF"
                point={8}
              />
            ))}
          </div>
          <div className="flex justify-start gap-4">
            {Array(pointCount[13]).fill(null).map((_, i) => (
              <VoteItem
                key={i}
                color="#9400D3"
                point={13}
              />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button className="bg-gray-300 text-black" onClick={handleNext}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}

interface VoteItemProps {
  point: number;
  color: string;
}

const VoteItem = ({ point, color }: VoteItemProps) => {
  return (
    <Button className={`bg-[${color}] text-white border-2 border-[${color}] hover:bg-[${color}]`} >
      {point}
    </Button>
  );
};
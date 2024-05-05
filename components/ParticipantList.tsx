"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Participant } from "@/lib/model/Participant";
import { useDatabase } from "reactfire";
import {useEffect, useState} from "react";
import { Loader2 } from "lucide-react";
import {get, off, onValue, ref} from "firebase/database";

interface ParticipantsListProps {
  roomId: string;
}

export function ParticipantsList({ roomId }: ParticipantsListProps) {
  const db = useDatabase();

  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const participantsRef = ref(db, `rooms/${roomId}/users`);

    onValue(participantsRef, (snapshot) => {
      const participants: Participant[] = [];
      snapshot.forEach((child: any) => {
        const p = child.val();
        participants.push(Participant(p));
      });
      setParticipants(participants);
      setLoading(false);
    });

    (async () => {
      try {
        const participantsSnapshot = await get(participantsRef);
        const participantsRaw = participantsSnapshot.val();
        if (participantsRaw != null) {
          const participants = Object
            .values(participantsRaw)
            .map((item: any) => Participant(item));
          setLoading(false);
          setParticipants(participants);
          return;
        }
      } catch (error) {
        console.error(error);
      }
    })();

    return () => {
      off(participantsRef);
    };
  }, [db, roomId]);

  if (loading) {
    return <Loader2 className="w-8 h-8" />;
  }

  console.log(participants);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Participants</CardTitle>
        <CardDescription>View the list of participants.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {participants.map((p, index) => (
            <div
              key={index}
              className={`p-2 rounded flex items-center ${p.voted ? 'bg-white border border-blue-500' : 'bg-gray-200'}`}
            >
              <span className="ml-2">{p.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
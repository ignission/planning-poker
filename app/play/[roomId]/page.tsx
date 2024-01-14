"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Participant } from "@/lib/model/participant";
import { Room } from "@/lib/model/room";
import { useUserProfilesStore } from "@/lib/store/UserProfilesStore";
import bs58 from "bs58";
import { FirebaseError } from "firebase/app";
import {
  equalTo,
  get,
  onChildChanged,
  orderByKey,
  query,
  ref,
} from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDatabase } from "reactfire";

export default function Play({ params }: { params: { roomId: string } }) {
  if (!params.roomId) {
    throw new Error("roomId is required");
  }
  const bytes = bs58.decode(params.roomId);
  const roomId = new TextDecoder().decode(bytes);
  const db = useDatabase();
  const router = useRouter();

  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const userProfiles = useUserProfilesStore((state) => state.userProfiles);

  useEffect(() => {
    try {
      const dbRef = ref(db, "rooms");
      const roomQuery = query(ref(db, "rooms"), orderByKey(), equalTo(roomId));

      get(roomQuery)
        .then((snapshot) => {
          if (!snapshot.exists()) {
            alert("ルームが見つかりませんでした。");
            router.push(`/`);
            return;
          }

          const data = snapshot.val();
          const room = Object.values(data)[0] as Room;

          setRoom(room);

          const target = userProfiles.filter((p) => p.roomId === roomId);

          if (target.length === 0) {
            router.push(`/join/${params.roomId}`);
            return;
          }

          const participantsQuery = query(ref(db, `rooms/${roomId}/users`));

          get(participantsQuery)
            .then((snapshot) => {
              const participantsRef = snapshot.val();
              const participants = Object.values(
                participantsRef,
              ) as Participant[];

              setParticipants(participants);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });

      return onChildChanged(dbRef, (snapshot) => {
        const value = snapshot.val();
        const participants = Object.values(value.users) as Participant[];

        setParticipants(participants);
      });
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error(e);
      }
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col flex-grow items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-300 dark:to-blue-400">
      <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-20" />
      <div className="flex gap-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Button Panel</CardTitle>
            <CardDescription>
              Select an action by clicking a button.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button className="bg-[#FF6347] text-white">Button 1</Button>
              <Button className="bg-[#32CD32] text-white">Button 2</Button>
              <Button className="bg-[#FFD700] text-black">Button 3</Button>
              <Button className="bg-[#1E90FF] text-white">Button 4</Button>
              <Button className="bg-[#9400D3] text-white">Button 5</Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button className="bg-gray-300 text-black">Reset</Button>
          </CardFooter>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Participants</CardTitle>
            <CardDescription>View the list of participants.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {participants.map((p) => (
                <div
                  key={p.id}
                  className="bg-gray-200 p-2 rounded flex items-center"
                >
                  <span className="ml-2">{p.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

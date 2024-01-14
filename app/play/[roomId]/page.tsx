"use client";

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
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
      {room?.name}
      <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-20" />
      {participants.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </h1>
  );
}

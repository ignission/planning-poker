"use client";

import { Room } from "@/lib/model/room";
import bs58 from "bs58";
import { FirebaseError } from "firebase/app";
import { equalTo, get, onChildChanged, orderByKey, query, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useDatabase } from "reactfire";

export default function Play({ params }: { params: { roomId: string } }) {
  if (!params.roomId) {
    throw new Error("roomId is required");
  }
  const bytes = bs58.decode(params.roomId);
  const roomId = new TextDecoder().decode(bytes);
  const db = useDatabase();
  const [room, setRoom] = useState<Room | undefined>(undefined);


  useEffect(() => {
  console.log(roomId);
    try {
      const dbRef = ref(db, "rooms");
      const roomQuery = query(ref(db, "rooms"), orderByKey(), equalTo(roomId));

      get(roomQuery)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const room = Object.values(data)[0] as Room;
            setRoom(room);
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });

      return onChildChanged(dbRef, (snapshot) => {
        const value = snapshot.val();
        // setChats((prev) => [...prev, { message: value.message }]);
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
    </h1>
  );
}

"use client";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  equalTo,
  get,
  orderByKey,
  push,
  query,
  ref,
  update,
} from "firebase/database";
import { FirebaseError } from "firebase/app";
import { useDatabase } from "reactfire";
import { useRouter } from "next/navigation";
import bs58 from "bs58";
import { Room } from "@/lib/model/room";
import { useUserProfilesStore } from "@/lib/store/UserProfilesStore";

export default function JoinRoom({ params }: { params: { roomId: string } }) {
  const [userName, setUserName] = useState("");

  const db = useDatabase();
  const router = useRouter();
  const userProfiles = useUserProfilesStore((state) => state.userProfiles);

  // @ts-ignore
  const { addUserProfile } = useUserProfilesStore();

  const bytes = bs58.decode(params.roomId);
  const roomId = new TextDecoder().decode(bytes);

  useEffect(() => {
    try {
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
          const target = userProfiles.filter((p) => p.roomId === roomId);

          if (room.hostUserId === target[0].userId) {
            router.push(`/play/${params.roomId}`);
            return;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error(e);
      }
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleJoinRoom = async () => {
    try {
      const userDbRef = ref(db, `rooms/${roomId}/users`);
      const userRef = await push(userDbRef, {
        name: userName,
      });
      const userId = userRef.key;

      await update(ref(db, `rooms/${roomId}/users/${userId}`), {
        id: userId,
        name: userName,
      });

      addUserProfile({
        roomId: roomId,
        userId: userId!,
        name: userName,
      });

      setUserName("");

      router.push(`/play/${params.roomId}`);
    } catch (e) {
      if (e instanceof FirebaseError) {
        alert("ルームへの参加に失敗しました。");
        console.log(e);
        return;
      }
    }
  };

  const isFormValid = () => {
    return userName !== "";
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-300 dark:to-blue-400">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">ルームに参加する</CardTitle>
          <CardDescription>すでに作られたルームへ参加します。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-name">あなたの名前</Label>
            <Input
              id="room-name"
              required
              type="text"
              className="focus:border-blue-500 focus-visible:ring-0"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full bg-blue-500 border-2 border-blue-500 hover:bg-white hover:text-blue-500 hover:border-blue-500 disabled:bg-blue-200 disabled:text-blue-400 disabled:border-blue-400"
            onClick={handleJoinRoom}
            disabled={!isFormValid()}
          >
            参加する
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

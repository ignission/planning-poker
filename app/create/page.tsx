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
import { useState } from "react";
import { push, ref, update } from "firebase/database";
import { FirebaseError } from "firebase/app";
import { useDatabase } from "reactfire";
import { useRouter } from "next/navigation";
import bs58 from "bs58";
import { useUserProfilesStore } from "@/lib/store/UserProfilesStore";

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const db = useDatabase();
  const router = useRouter();

  // @ts-ignore
  const { addUserProfile } = useUserProfilesStore();

  const handleCreateRoom = async () => {
    try {
      const roomDbRef = ref(db, "rooms");
      const roomRef = await push(roomDbRef, {
        name: roomName,
        hostUserId: "",
      });

      const roomId = roomRef.key!;
      const userDbRef = ref(db, `rooms/${roomId}/users`);
      const userRef = await push(userDbRef, {
        name: userName,
      });

      const userId = userRef.key;
      await update(ref(db, `rooms/${roomId}`), {
        hostUserId: userId,
      });

      await update(ref(db, `rooms/${roomId}/users/${userId}`), {
        id: userId,
        name: userName,
      });

      addUserProfile({
        roomId: roomRef.key!,
        userId: userRef.key!,
        name: userName,
      });

      setRoomName("");
      setUserName("");

      const bytes = Buffer.from(roomRef.key!);
      const encodedKey = bs58.encode(bytes);

      router.push(`/play/${encodedKey}`);
    } catch (e) {
      if (e instanceof FirebaseError) {
        alert("ルームの作成に失敗しました。");
        console.log(e);
        return;
      }
    }
  };

  const isFormValid = () => {
    return roomName !== "" && userName !== "";
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-300 dark:to-blue-400">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">ルームを作成する</CardTitle>
          <CardDescription>新しくルームを作成します。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-name">ルーム名</Label>
            <Input
              id="room-name"
              required
              type="text"
              className="focus:border-blue-500 focus-visible:ring-0"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>
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
            onClick={handleCreateRoom}
            disabled={!isFormValid()}
          >
            作成する
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

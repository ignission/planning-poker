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
import { useUserProfilesStore } from "@/lib/store/UserProfilesStore";
import bs58 from "bs58";
import { FirebaseError } from "firebase/app";
import {
  child,
  equalTo,
  get,
  onChildChanged,
  onDisconnect,
  orderByKey,
  query,
  ref,
  update,
} from "firebase/database";
import { Loader2 } from "lucide-react";
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

  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const userProfiles = useUserProfilesStore((state) => state.userProfiles);

  const handleVoteClick = (point: number) => {
    setSelectedPoint(point);
  };

  const resetSelection = () => {
    setSelectedPoint(null);
  };

  useEffect(() => {
    try {
      const dbRef = ref(db, "rooms");
      const roomQuery = query(dbRef, orderByKey(), equalTo(roomId));

      get(roomQuery)
        .then((snapshot) => {
          if (!snapshot.exists()) {
            alert("ルームが見つかりませんでした。");
            router.push(`/`);
            return;
          }

          const target = userProfiles.filter((p) => p.roomId === roomId);
          if (target.length === 0) {
            router.push(`/join/${params.roomId}`);
            return;
          }

          const participantsQuery = query(ref(db, `rooms/${roomId}/users`));

          get(participantsQuery)
            .then((snapshot) => {
              const participantsRef = snapshot.val();
              if (participantsRef === null) {
                setParticipants([
                  { id: target[0].userId, name: target[0].name },
                ]);
                const userDbRef = ref(db, `rooms/${roomId}/users`);
                const userRef = child(userDbRef, target[0].userId);
                update(userRef, {
                  name: target[0].name,
                });
                setLoading(false);
                return;
              }
              const participants = Object.values(
                participantsRef,
              ) as Participant[];

              setParticipants(participants);
              setLoading(false);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });

      return () => {
        onChildChanged(dbRef, (snapshot) => {
          const value = snapshot.val();
          if (value.users === undefined) {
            setParticipants([value]);
            return;
          }
          const participants = Object.values(value.users) as Participant[];
          if (participants.length === 0) {
            router.replace(`/`);
          }
          setParticipants(participants);
        });
        const target = userProfiles.filter((p) => p.roomId === roomId);
        if (target.length === 0) {
          return;
        }
        const me = target[0];
        onDisconnect(ref(db, `rooms/${roomId}/users/${me.userId}`)).remove();
      };
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
      {loading ? (
        <Loader2 className="h-20 w-20 animate-spin text-blue-300" />
      ) : (
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
                <VoteButton
                  color="#FF6347"
                  point={1}
                  selected={selectedPoint}
                  onClick={handleVoteClick}
                />
                <VoteButton
                  color="#32CD32"
                  point={3}
                  selected={selectedPoint}
                  onClick={handleVoteClick}
                />
                <VoteButton
                  color="#FFD700"
                  point={5}
                  selected={selectedPoint}
                  onClick={handleVoteClick}
                />
                <VoteButton
                  color="#1E90FF"
                  point={8}
                  selected={selectedPoint}
                  onClick={handleVoteClick}
                />
                <VoteButton
                  color="#9400D3"
                  point={13}
                  selected={selectedPoint}
                  onClick={handleVoteClick}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="bg-gray-300 text-black"
                onClick={resetSelection}
              >
                Reset
              </Button>
            </CardFooter>
          </Card>
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
                    className="bg-gray-200 p-2 rounded flex items-center"
                  >
                    <span className="ml-2">{p.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

interface VoteButtonProps {
  color: string;
  point: number;
  selected: number | null;
  onClick?: (point: number) => void;
}

export const VoteButton: React.FC<VoteButtonProps> = ({
  color,
  point,
  selected,
  onClick,
}) => {
  const toggleStyle = () => {
    if (onClick) {
      onClick(point);
    }
  };

  const buttonStyle =
    point == selected
      ? `bg-[${color}] text-white border-2 border-[${color}] hover:bg-[${color}]`
      : `border-2 border-[${color}] text-${color} bg-transparent hover:bg-white`;

  return (
    <Button className={buttonStyle} onClick={toggleStyle}>
      {point}
    </Button>
  );
};

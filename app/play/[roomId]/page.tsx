"use client";

import { UserVote } from "@/lib/model/UserVote";
import {
  UserProfile,
  useUserProfilesStore,
} from "@/lib/store/UserProfilesStore";
import bs58 from "bs58";
import {
  DataSnapshot,
  DatabaseReference,
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
import { VotePanel } from "@/components/VotePanel";
import { ParticipantsList } from "@/components/ParticipantList";
import { Participant } from "@/lib/model/Participant";

export default function Play({ params }: { params: { roomId: string } }) {
  if (!params.roomId) {
    throw new Error("roomId is required");
  }
  const bytes = bs58.decode(params.roomId);
  const roomId = new TextDecoder().decode(bytes);
  const db = useDatabase();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const userProfiles = useUserProfilesStore((state) => state.userProfiles);



  useEffect(() => {
    const getRoomSnapshot = () :Promise<DataSnapshot> => {
      const dbRef = ref(db, "rooms");
      const roomQuery = query(dbRef, orderByKey(), equalTo(roomId));
      return get(roomQuery);
    };

    const getParticipantsSnapshot = (): Promise<DataSnapshot> => {
      const usersQuery = query(ref(db, `rooms/${roomId}/users`));
      return get(usersQuery);
    };

    const validateRoomExists = async (): Promise<void> => {
      const roomSnapshot = await getRoomSnapshot();
      if (!roomSnapshot.exists()) {
        alert("ルームが見つかりませんでした。");
        router.push(`/`);
        return;
      }
    };

    const validateRecentlyJoined = (): UserProfile | null => {
      const target = userProfiles.filter((p) => p.roomId === roomId);
      if (target.length === 0) {
        router.push(`/join/${params.roomId}`);
        return null;
      }

      return target[0];
    };

    const updateMyself = async (
      target: UserProfile,
    ): Promise<void> => {
      const participantsSnapshot = await getParticipantsSnapshot();
      const participantsRef = participantsSnapshot.val();
      if (participantsRef === null) {
        await update(ref(db, `rooms/${roomId}/users/${target.userId}`), {
          id: target.userId,
          name: target.name,
        });
      }
    };

    (async () => {
      try {
        await validateRoomExists();
        const myself =  validateRecentlyJoined();
        if (myself != null) {
          await updateMyself(myself);
          setUser(myself);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    })();

    return ()  => {
      const dbRef = ref(db, "rooms");
      (async () => {
        await setupRealtimeUpdates(dbRef);
      })();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupRealtimeUpdates = async (dbRef: DatabaseReference) => {
    onChildChanged(dbRef, (snapshot) => {
      const value = snapshot.val();
      if (value.users === undefined) {
        return;
      }
      const participants = Object.values(value.users) as Participant[];

      if (participants.length === 0) {
        router.replace(`/`);
      }

      if (participants.length === 1) {
        return;
      }

      if (participants.length > 1) {
        const votes = value.votes
          ? (Object.values(value.votes) as UserVote[])
          : [];
        const participantIds = participants.map((p) => p.id);
        const voteUserIds = votes.map((v) => v.userId);
        const allParticipantsVoted = participantIds.every((id) =>
          voteUserIds.includes(id),
        );
      }
    });

    const target = userProfiles.filter((p) => p.roomId === roomId);
    if (target.length === 0) {
      return;
    }

    const me = target[0];
    await onDisconnect(ref(db, `rooms/${roomId}/users/${me.userId}`)).remove();
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-300 dark:to-blue-400">
      <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-20" />
      {loading ? (
        <Loader2 className="h-20 w-20 animate-spin text-blue-300" />
      ) : (
        <div className="flex gap-4">
          <VotePanel
            roomId={roomId}
            userId={user?.userId!}
          ></VotePanel>
          <ParticipantsList roomId={roomId} />
        </div>
      )}
    </div>
  );
}

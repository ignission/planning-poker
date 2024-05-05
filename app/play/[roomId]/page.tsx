"use client";

import { Participant } from "@/lib/model/participant";
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
  remove,
  update,
} from "firebase/database";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDatabase } from "reactfire";
import { VotePanel } from "@/components/VotePanel";
import { ParticipantsList } from "@/components/ParticipantList";

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const userProfiles = useUserProfilesStore((state) => state.userProfiles);

  const handleVoteClick = (point: number) => {
    setSelectedPoint(point);

    const myUserId = user!.userId;
    update(ref(db, `rooms/${roomId}/votes/${myUserId}`), {
      userId: myUserId,
      point: point,
    });
  };

  const resetSelection = () => {
    setSelectedPoint(null);

    const myUserId = user!.userId;
    remove(ref(db, `rooms/${roomId}/votes/${myUserId}`));
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      const roomSnapshot = await getRoomSnapshot();
      if (!roomSnapshot.exists()) {
        alert("ルームが見つかりませんでした。");
        router.push(`/`);
        return;
      }
    };

    const getRoomSnapshot = () => {
      const dbRef = ref(db, "rooms");
      const roomQuery = query(dbRef, orderByKey(), equalTo(roomId));
      return get(roomQuery);
    };

    const handleParticipants = async () => {
      const target = userProfiles.filter((p) => p.roomId === roomId);
      if (target.length === 0) {
        router.push(`/join/${params.roomId}`);
        return;
      }

      const participantsSnapshot = await getParticipantsSnapshot();
      const myself = target[0];
      updateParticipants(participantsSnapshot, myself);
      setUser(myself);
      return myself;
    };

    const getParticipantsSnapshot = () => {
      return get(query(ref(db, `rooms/${roomId}/users`)));
    };

    const updateParticipants = (
      participantsSnapshot: DataSnapshot,
      target: UserProfile,
    ) => {
      const participantsRef = participantsSnapshot.val();
      if (participantsRef === null) {
        const newParticipant = [{ id: target.userId, name: target.name }];
        setParticipants(newParticipant);
        update(ref(db, `rooms/${roomId}/users/${target.userId}`), {
          id: target.userId,
          name: target.name,
        });
      } else {
        const participants = Object.values(participantsRef) as Participant[];
        setParticipants(participants);
      }
      setLoading(false);
    };

    const updateVote = async (myself: UserProfile) => {
      const myUserId = myself.userId;
      const myVoteRef = ref(db, `rooms/${roomId}/votes/${myUserId}`);
      const myVoteSnapshot = await get(query(myVoteRef));
      const value = myVoteSnapshot.val();
      if (value === null) {
        setSelectedPoint(null);
        return;
      }
      setSelectedPoint(value.point);
    };

    (async () => {
      try {
        await fetchRoomData();
        const myself = await handleParticipants();
        if (myself != null) {
          await updateVote(myself);
        }
      } catch (error) {
        console.error(error);
      }
    })();

    return () => {
      const dbRef = ref(db, "rooms");
      setupRealtimeUpdates(dbRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupRealtimeUpdates = (dbRef: DatabaseReference) => {
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
    onDisconnect(ref(db, `rooms/${roomId}/users/${me.userId}`)).remove();
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-300 dark:to-blue-400">
      <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-20" />
      {loading ? (
        <Loader2 className="h-20 w-20 animate-spin text-blue-300" />
      ) : (
        <div className="flex gap-4">
          <VotePanel
            selectedPoint={selectedPoint}
            handleVoteClick={handleVoteClick}
            resetSelection={resetSelection}
          ></VotePanel>
          <ParticipantsList participants={participants} />
        </div>
      )}
    </div>
  );
}

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserProfile {
  roomId: string;
  name: string;
}

interface UserProfilesState {
  userProfiles: UserProfile[];
  addUserProfile: (profile: UserProfile) => void;
  removeUserProfile: (roomId: string) => void;
}

export const useUserProfilesStore = create(
  persist(
    (set) => ({
      userProfiles: [],
      addUserProfile: (profile: UserProfile) =>
        set((state: UserProfilesState) => ({
          userProfiles: [...state.userProfiles, profile],
        })),
      removeUserProfile: (roomId: string) =>
        set((state: UserProfilesState) => ({
          userProfiles: state.userProfiles.filter((p) => p.roomId !== roomId),
        })),
    }),
    {
      name: "user-profiles-storage",
      getStorage: () => localStorage,
    },
  ),
);

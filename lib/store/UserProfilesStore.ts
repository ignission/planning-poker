import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface UserProfile {
  roomId: string;
  name: string;
}

export interface UserProfilesState {
  userProfiles: UserProfile[];
  addUserProfile: (profile: UserProfile) => void;
  removeUserProfile: (roomId: string) => void;
}

export const useUserProfilesStore = create<UserProfilesState>()(
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
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

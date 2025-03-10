import { updateUser } from "@/libs/web-apis/src";
import { IUser, IRole } from "@agent-xenon/interfaces";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IUserStore {
  user: IUser<IRole> | null;
}

export const useUserStore = create<IUserStore>()(
  immer((set) => ({
    user: null
  }))
);

export const setUser = (user: IUser<IRole>) => {
  useUserStore.setState({ user })
}

export const updateUserData = (user: Partial<IUser<IRole>>) => {
  useUserStore.setState((state) => {
    if (state.user) {
      state.user = { ...state.user, ...user };
    }
  });

  try {
    updateUser({ _id: user._id, firstName: user.firstName, lastName: user.lastName, });
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

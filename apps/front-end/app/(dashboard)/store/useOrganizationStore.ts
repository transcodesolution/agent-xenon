import { updateOrganization } from "@/libs/web-apis/src/lib/organization";
import { IOrganization } from "@agent-xenon/interfaces";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IOrganizationStore {
  organization: IOrganization;
}

export const useOrganizationStore = create<IOrganizationStore>()(
  immer((set) => ({
    organization: {} as IOrganization,
  }))
);

export const setOrganization = (organization: IOrganization) => {
  useOrganizationStore.setState({ organization })
}


export const updateOrganizationData = (organization: Partial<IOrganization>) => {
  useOrganizationStore.setState((state) => {
    if (state.organization) {
      state.organization = { ...state.organization, ...organization };
    }
  });

  try {
    updateOrganization({ name: organization.name, address: organization.address, description: organization.description });
  } catch (error) {
    console.error("Error updating organization:", error);
  }
};



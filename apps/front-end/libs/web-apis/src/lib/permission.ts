'use server'

import { IGetPermissionsResponse } from "@/libs/types-api/src";
import { Permission } from "@agent-xenon/constants";
import axios from "axios";
import { cookies } from "next/headers";

export const getPermissions = async (): Promise<IGetPermissionsResponse> => {
  const cookieStore = await cookies();
  const bearerToken = cookieStore.get('token')?.value || '';

  return { data: { permissions: [Permission.JOB_READ, Permission.JOB_CREATE] }, message: '' }
  try {
    const result = await axios.get<IGetPermissionsResponse>('/api/auth/signin', {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error while getting permissions: ${error}`);
  }
};
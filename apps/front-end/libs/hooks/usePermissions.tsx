import { useEffect, useState } from "react";
import { PERMISSION_CONFIG } from "../utils/permissionChecks";
import { checkPermissions, usePermissionStore } from "../store/src";

type PermissionKey = keyof typeof PERMISSION_CONFIG;

export const usePermissions = () => {
  const { permissions } = usePermissionStore();
  const [checkedPermissions, setCheckedPermissions] = useState<Record<PermissionKey, boolean>>({} as Record<PermissionKey, boolean>);

  useEffect(() => {
    const permissionsChecked = Object.keys(PERMISSION_CONFIG).reduce((acc: { [k: string]: boolean }, key) => {
      acc[key] = checkPermissions({ permissions: PERMISSION_CONFIG[key] });
      return acc;
    }, {});

    setCheckedPermissions(permissionsChecked);
  }, [permissions]);

  return checkedPermissions;
};
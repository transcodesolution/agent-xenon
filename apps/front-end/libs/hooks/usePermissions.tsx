import { useEffect, useState } from "react";
import { PERMISSIONS } from "../utils/permissionChecks";
import { checkPermissions, usePermissionStore } from "../store/src";

export const usePermissions = () => {
  const { permissions } = usePermissionStore();
  const [checkedPermissions, setCheckedPermissions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const permissionsChecked = Object.keys(PERMISSIONS).reduce((acc: { [k: string]: boolean }, key) => {
      acc[key] = checkPermissions({ permissions: PERMISSIONS[key] });
      return acc;
    }, {});

    setCheckedPermissions(permissionsChecked);
  }, [permissions]);

  return checkedPermissions;
};

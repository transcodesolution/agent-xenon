import { Stack } from "@mantine/core";
import React from "react";
import { ApplicantList } from "./_components/ApplicantList";

export default function Page() {

  return (
    <Stack gap="sm">
      <ApplicantList />
    </Stack>
  );
}

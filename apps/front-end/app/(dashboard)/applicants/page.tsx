'use client'
import { Stack, Title } from "@mantine/core";
import React from "react";
import { ApplicantList } from "./_components/ApplicantList";
import { ApplicantFilter } from "./_components/ApplicantFilter";

export default function Page() {
  return (
    <Stack gap='sm'>
      <Title order={4} >Applicants</Title>
      <ApplicantFilter />
      <ApplicantList />
    </Stack>
  );
}

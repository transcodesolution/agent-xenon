import React from "react"
import { QuestionDetails } from "./_components/QuestionDetails"
import BackToOverview from "@/libs/components/custom/back-to-overview"
import { Stack } from "@mantine/core"

export default function Page() {
  return (
    <Stack pos='relative'>
      <BackToOverview title="Back" backUrl='/interview-questions' />
      <QuestionDetails />
    </Stack>
  )
}
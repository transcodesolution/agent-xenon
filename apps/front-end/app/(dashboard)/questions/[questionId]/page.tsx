'use client'
import React from "react"
import { QuestionDetails } from "./_components/QuestionDetails"
import BackToOverview from "@/libs/components/custom/back-to-overview"

export default function Page() {
  return (
    <React.Fragment>
      <BackToOverview title="Back" backUrl='/questions' />
      <QuestionDetails />
    </React.Fragment>
  )
}
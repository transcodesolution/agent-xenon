"use client";
import { Tabs, ScrollArea } from "@mantine/core";
import { useState } from "react";
import { ApplicantDetailsForm } from "./ApplicantDetailsForm";
import { ApplicantUploadForm } from "./ApplicantUploadForm";

export default function ApplicantModal({ refetch, onClose, applicantId }: { refetch: () => void, onClose: () => void, applicantId: string }) {
  const [activeTab, setActiveTab] = useState<'details' | 'upload'>("details");

  return (
    <Tabs value={activeTab} onChange={(value) => setActiveTab(value as 'details' | 'upload')} variant="outline">
      <ScrollArea offsetScrollbars={true}>
        <Tabs.List>
          <Tabs.Tab value="details">Enter Details</Tabs.Tab>
          <Tabs.Tab value="upload">Upload Documents</Tabs.Tab>
        </Tabs.List>
      </ScrollArea>

      <Tabs.Panel value="details">
        <ApplicantDetailsForm refetch={refetch} onClose={onClose} applicantId={applicantId} />
      </Tabs.Panel>

      <Tabs.Panel value="upload">
        <ApplicantUploadForm refetch={refetch} onClose={onClose} />
      </Tabs.Panel>
    </Tabs>
  );
}

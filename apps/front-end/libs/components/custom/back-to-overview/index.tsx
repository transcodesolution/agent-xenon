"use client";

import { useRouter } from "next/navigation";
import { Anchor, Flex, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";

interface IBackToOverview {
  title?: string;
  backUrl?: string;
}

export function BackToOverview({ title = "Back", backUrl }: IBackToOverview) {
  const router = useRouter();

  const handleBack = (event: React.MouseEvent) => {
    event.preventDefault();
    backUrl ? router.push(backUrl) : router.back();
  };

  return (
    <Anchor onClick={handleBack}>
      <Flex align="center" gap={4} mb="md">
        <IconChevronLeft />
        <Text truncate>{title}</Text>
      </Flex>
    </Anchor>
  );
}

export default BackToOverview;

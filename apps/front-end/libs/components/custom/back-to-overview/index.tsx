"use client";

import { useRouter } from "next/navigation";
import { Group, Flex, Text, Anchor } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";

interface IBackToOverview {
  title: string;
  backUrl?: string;
  fullWidth?: boolean;
  withMarginBottom?: boolean;
}

export function BackToOverview({
  title = "Back",
  backUrl,
  fullWidth = false,
  withMarginBottom = true,
}: IBackToOverview) {
  const router = useRouter();

  return (
    <Group
      justify="space-between"
      align="center"
      mb={withMarginBottom ? 16 : 0}
      style={{ flexWrap: "nowrap", width: fullWidth ? "100%" : "auto" }}
    >
      {backUrl ? (
        backUrl.startsWith("http") ? (
          <Anchor href={backUrl} >
            <Flex align="center" gap={4}>
              <IconChevronLeft />
              <Text truncate>{title}</Text>
            </Flex>
          </Anchor>
        ) : (
          <Anchor onClick={() => router.push(backUrl)} >
            <Flex align="center" gap={4}>
              <IconChevronLeft />
              <Text truncate>{title}</Text>
            </Flex>
          </Anchor>
        )
      ) : (
        <Flex align="center" gap={4} onClick={() => router.back()} >
          <IconChevronLeft />
          <Text truncate>{title}</Text>
        </Flex>
      )}
    </Group>
  );
}

export default BackToOverview;

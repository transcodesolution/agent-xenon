import { DataTableColumn } from "mantine-datatable";
import { IApplicant } from "@agent-xenon/interfaces";
import { ActionIcon } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import dayjs from "dayjs";

export const getApplicantColumns = (
  sortStatus: {
    columnAccessor: string;
    direction: string;
  },
  onEdit: (applicantId: string) => void,
): DataTableColumn<IApplicant>[] => {
  return [
    {
      accessor: "name",
      title: "Name",
      ellipsis: true,
      sortable: true,
      width: 150,
      render: ({ firstName, lastName }) => `${firstName} ${lastName}`,
    },
    {
      accessor: "contactInfo.email",
      title: "Email",
      ellipsis: true,
      sortable: true,
      width: 200,
      render: ({ contactInfo }) => contactInfo?.email || "-",
    },
    {
      accessor: "experienceDetails[0].role",
      title: "Role",
      ellipsis: true,
      sortable: true,
      width: 150,
      render: ({ experienceDetails }) => experienceDetails?.[0]?.role || "-",
    },
    {
      accessor: "skills",
      title: "Skills",
      ellipsis: true,
      sortable: false,
      width: 200,
      render: ({ skills }) => skills?.length ? skills.join(", ") : "-",
    },
    {
      accessor: "createdAt",
      title: "Applied Date",
      ellipsis: true,
      sortable: true,
      width: 180,
      render: ({ createdAt }) =>
        createdAt ? dayjs(createdAt).format('DD-MM-YYYY | HH:mm') : '-'

    },
    {
      accessor: "actions",
      title: "Actions",
      width: 100,
      render: (applicant) => (
        <ActionIcon bg='var(--mantine-color-teal-filled-hover)' onClick={() => onEdit(applicant._id)}>
          <IconEdit size="1.5rem" />
        </ActionIcon>
      ),
    },
  ];
};

export default getApplicantColumns;

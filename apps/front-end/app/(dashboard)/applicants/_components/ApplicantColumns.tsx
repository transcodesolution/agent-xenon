import { DataTableColumn } from "mantine-datatable";
import { IApplicant } from "@agent-xenon/interfaces";
import { Anchor } from "@mantine/core";
import dayjs from "dayjs";
import Link from "next/link";

export const getApplicantColumns = (
  sortStatus: {
    columnAccessor: string;
    direction: string;
  },
): DataTableColumn<IApplicant>[] => {
  return [
    {
      accessor: "name",
      title: "Name",
      ellipsis: true,
      sortable: true,
      width: 150,
      render: ({ firstName, lastName, _id }) => {
        return (
          <Anchor component={Link} href={`/applicants/${_id}`} style={{ position: 'relative' }}>{firstName || lastName ? `${firstName} ${lastName}` : '-'}</Anchor>
        );
      },
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

    }
  ];
};

export default getApplicantColumns;

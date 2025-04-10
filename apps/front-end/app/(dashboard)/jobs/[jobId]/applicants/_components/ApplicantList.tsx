"use client";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import React, { useState } from "react";
import { IApplicant } from "@agent-xenon/interfaces";
import { getApplicantColumns } from "./ApplicantColumns";
import { ActionIcon, Badge, Button, Flex, Group, Modal, Paper, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { FilterParams, updateUrlParams } from "@/libs/utils/updateUrlParams";
import { useGetApplicants, useDeleteApplicants } from "@agent-xenon/react-query-hooks";
import ApplicantModal from "./ApplicantModal";
import { useConfirmDelete } from "@/libs/hooks/useConfirmDelete";

const PAGE_SIZES = [50, 100, 200, 500, 1000];
const SORT_ORDER = ["asc", "desc"];

export function ApplicantList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedApplicants, setSelectedApplicants] = useState<IApplicant[]>([]);
  const { jobId } = useParams<{ jobId: string }>();
  const [isModalOpen, setModalOpen] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || PAGE_SIZES[0];
  const sortColumn = searchParams.get("sortColumn") || "appliedDate";
  const sortOrder = SORT_ORDER.includes(searchParams.get("sortOrder") || "") ? searchParams.get("sortOrder") : "desc";
  const [editingApplicantId, setEditingApplicantId] = useState<string>('');
  const confirmDelete = useConfirmDelete();


  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IApplicant>>({
    columnAccessor: sortColumn,
    direction: sortOrder as "asc" | "desc",
  });

  const { data: getApplicantsResponse, isLoading, refetch } = useGetApplicants({
    page,
    limit: pageSize,
    jobId,
  });
  const applicants = getApplicantsResponse?.data?.applicants || [];
  const totalApplicants = getApplicantsResponse?.data?.totalData;
  const resumeProcessByJobCount = getApplicantsResponse?.data?.state?.resumeProcessByJobCount || 0;

  const { deleteApplicantsMutation } = useDeleteApplicants();

  const handleApplyFilter = (filters: FilterParams) => {
    const newSearchParams = updateUrlParams(filters);
    router.push(`${newSearchParams.toString()}`);
  };

  const handleChangePage = (pageNumber: number) => {
    handleApplyFilter({ page: pageNumber.toString() });
  };

  const handleChangePageSize = (pageSize: number) => {
    handleApplyFilter({ pageSize: pageSize.toString() });
  };

  const handleSortStatusChange = (status: DataTableSortStatus<IApplicant>) => {
    handleChangePage(1);
    setSortStatus(status);
  };

  const handleDeleteSelected = () => {
    const applicantIds = selectedApplicants.map((a) => String(a._id));

    confirmDelete({
      itemName: applicantIds.length > 1 ? 'these applicants' : 'this applicant',
      onConfirm: () => {
        deleteApplicantsMutation.mutate(
          { jobId, applicantIds },
          {
            onSuccess: () => {
              refetch();
              setSelectedApplicants([]);
            },
          }
        );
      },
    });
  };

  const handleEditApplicant = (applicantId: string) => {
    setEditingApplicantId(applicantId);
    setModalOpen(true);
  };



  const columns = getApplicantColumns(sortStatus, handleEditApplicant);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedApplicants([])
    setEditingApplicantId('');
  };

  return (
    <>
      <Flex gap='md' align="center" justify='space-between'>
        <Group>
          <Button onClick={() => setModalOpen(true)}>
            + Add
          </Button>
          {selectedApplicants.length > 0 && (
            <ActionIcon color="red" onClick={handleDeleteSelected}>
              <IconTrash size="1.5rem" />
            </ActionIcon>
          )}
        </Group>
        {resumeProcessByJobCount > 0 && (
          <Badge variant="light" color='orange'>
            <Text size="sm">
              {resumeProcessByJobCount} applicants pending to be processed.
            </Text>
          </Badge>
        )}
      </Flex>
      <DataTable
        idAccessor="_id"
        highlightOnHover
        records={applicants}
        fetching={isLoading}
        selectedRecords={selectedApplicants}
        onSelectedRecordsChange={setSelectedApplicants}
        page={page}
        onPageChange={handleChangePage}
        recordsPerPage={pageSize}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={handleChangePageSize}
        noRecordsText="No Applicants Found"
        recordsPerPageLabel=""
        sortStatus={sortStatus}
        onSortStatusChange={handleSortStatusChange}
        columns={columns}
        totalRecords={totalApplicants}
      />

      <Modal opened={isModalOpen} size='100%' onClose={closeModal} title={editingApplicantId ? "Update" : "Add"}>
        <ApplicantModal refetch={refetch} onClose={closeModal} applicantId={editingApplicantId} />
      </Modal>
    </>
  );
}

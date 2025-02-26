"use client";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import React, { useState } from "react";
import { IApplicant } from "@agent-xenon/interfaces";
import { getApplicantColumns } from "./ApplicantColumns";
import { ActionIcon, Button, Flex, Modal } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { FilterParams, updateUrlParams } from "@/libs/utils/updateUrlParams";
import { useGetApplicants, useDeleteApplicants } from "@agent-xenon/react-query-hooks";
import ApplicantModal from "./ApplicantModal";

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


  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IApplicant>>({
    columnAccessor: sortColumn,
    direction: sortOrder as "asc" | "desc",
  });

  const { data, isLoading, refetch } = useGetApplicants({
    page,
    limit: pageSize,
    jobId,
  });

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
    const applicantIds = selectedApplicants.map((applicant) => String(applicant._id));
    deleteApplicantsMutation.mutate(
      { applicantIds },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
    setSelectedApplicants([]);
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
      <Flex gap='md' align="center" mb='md'>
        <Button onClick={() => setModalOpen(true)}>
          + Add Applicant
        </Button>
        {selectedApplicants.length > 0 && (
          <ActionIcon color="red" onClick={handleDeleteSelected}>
            <IconTrash size="1.5rem" />
          </ActionIcon>
        )}
      </Flex>

      <DataTable
        idAccessor="_id"
        highlightOnHover
        records={data?.data?.applicantData || []}
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
        totalRecords={data?.data?.totalData}
      />

      <Modal opened={isModalOpen} size='100%' onClose={closeModal} title="Create Applicant">
        <ApplicantModal refetch={refetch} onClose={closeModal} applicantId={editingApplicantId} />
      </Modal>
    </>
  );
}

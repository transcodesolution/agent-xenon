"use client";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { IApplicant } from "@agent-xenon/interfaces";
import { ActionIcon, Paper } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { FilterParams, updateUrlParams } from "@/libs/utils/updateUrlParams";
import { useGetApplicants, useDeleteApplicants } from "@agent-xenon/react-query-hooks";
import getApplicantColumns from "./ApplicantColumns";

const PAGE_SIZES = [50, 100, 200, 500, 1000];
const SORT_ORDER = ["asc", "desc"];

export function ApplicantList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedApplicants, setSelectedApplicants] = useState<IApplicant[]>([]);
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || PAGE_SIZES[0];
  const sortColumn = searchParams.get("sortColumn") || "appliedDate";
  const searchText = searchParams.get("search") || "";
  const sortOrder = SORT_ORDER.includes(searchParams.get("sortOrder") || "") ? searchParams.get("sortOrder") : "desc";


  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IApplicant>>({
    columnAccessor: sortColumn,
    direction: sortOrder as "asc" | "desc",
  });

  const { data: getApplicantsResponse, isLoading, refetch } = useGetApplicants({
    page,
    limit: pageSize,
    search: searchText
  });

  const applicants = getApplicantsResponse?.data?.applicants ?? [];
  const totalData = getApplicantsResponse?.data?.totalData ?? 0;

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


  const columns = getApplicantColumns(sortStatus);

  return (
    <React.Fragment>
      {selectedApplicants.length > 0 && (
        <ActionIcon color="red" onClick={handleDeleteSelected}>
          <IconTrash size="1.5rem" />
        </ActionIcon>
      )}
      <Paper withBorder shadow="md" p="md">
        <DataTable
          idAccessor="_id"
          highlightOnHover
          records={applicants || []}
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
          totalRecords={totalData}
        />
      </Paper>
    </React.Fragment>
  );
}

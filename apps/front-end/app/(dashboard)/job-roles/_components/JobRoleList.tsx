'use client'
import { FilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { ActionIcon, Anchor } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable'
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { usePermissions } from '@/libs/hooks/usePermissions';
import { useGetJobRoles, useDeleteJobRoles } from '@agent-xenon/react-query-hooks';
import { IJobRole } from '@agent-xenon/interfaces';

const PAGE_SIZES = [50, 100, 200, 500, 1000];
const SORT_ORDER = ['asc', 'desc'];

export const JobRoleList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || PAGE_SIZES[0];
  const search = searchParams.get('search') || ''
  const sortColumn = searchParams.get('sortColumn') || 'lastUpdatedDate';
  const sortOrder = SORT_ORDER.includes(searchParams.get('sortOrder') || '') ? searchParams.get('sortOrder') : 'desc';

  const { data, isLoading, refetch } = useGetJobRoles({ page: Number(page), limit: Number(pageSize), search: search });
  const [selectedJobRoles, setSelectedJobRoles] = useState<IJobRole[]>([]);
  const { deleteJobRolesMutation } = useDeleteJobRoles();
  const permission = usePermissions()

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IJobRole>>({
    columnAccessor: sortColumn,
    direction: sortOrder as 'asc' | 'desc',
  });
  const handleApplyFilter = (filters: FilterParams) => {
    const newSearchParams = updateUrlParams(filters);
    router.push(`${newSearchParams.toString()}`);
  };

  const handleChangePage = (pageNumber: number) => {
    handleApplyFilter({ 'page': pageNumber.toString() })
  };

  const handleChangePageSize = (pageNumber: number) => {
    handleApplyFilter({ 'pageSize': pageNumber.toString() })
  };

  const handleSortStatusChange = (status: DataTableSortStatus<IJobRole>) => {
    handleChangePage(1);
    setSortStatus?.(status);
  };

  const columns: DataTableColumn<IJobRole>[] = [
    {
      accessor: 'name',
      title: 'JobRole',
      ellipsis: true,
      sortable: true,
      width: 325,
      render: ({ name, _id }) => {
        return (
          <Anchor component={Link} href={`/job-roles/${_id}`} style={{ position: 'relative' }}>{name || '-'}</Anchor>
        );
      },
    },
    {
      accessor: 'description',
      title: 'Description',
      ellipsis: true,
      sortable: false,
    }
  ]

  const handleDeleteSelected = () => {
    const jobRoleIds = selectedJobRoles.map((role) => String(role._id));
    deleteJobRolesMutation.mutate(
      { jobRoleIds },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
    setSelectedJobRoles([])
  };

  return (
    <React.Fragment>
      {
        permission?.hasJobDelete && selectedJobRoles.length > 0 &&
        <ActionIcon color='red' onClick={handleDeleteSelected}>
          <IconTrash size="1.5rem" />
        </ActionIcon>
      }
      <DataTable
        idAccessor='_id'
        highlightOnHover
        records={data?.data?.jobRoles}
        fetching={isLoading}
        selectedRecords={selectedJobRoles}
        onSelectedRecordsChange={setSelectedJobRoles}
        page={page}
        onPageChange={handleChangePage}
        totalRecords={3}
        recordsPerPage={pageSize}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={handleChangePageSize}
        noRecordsText='No Data To Show'
        recordsPerPageLabel=""
        sortStatus={sortStatus}
        onSortStatusChange={handleSortStatusChange}
        columns={columns}
      />
    </React.Fragment>
  )
}
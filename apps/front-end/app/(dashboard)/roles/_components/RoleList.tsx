'use client'
import { useGetRoles } from '@/libs/react-query-hooks/src/lib/role'
import { FilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { IRole } from '@agent-xenon/interfaces';
import { ActionIcon, Text } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

const PAGE_SIZES = [50, 100, 200, 500, 1000];
const SORT_ORDER = ['asc', 'desc'];

export const RoleList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || PAGE_SIZES[0];
  const search = searchParams.get('search') || ''
  const sortColumn = searchParams.get('sortColumn') || 'lastUpdatedDate';
  const sortOrder = SORT_ORDER.includes(searchParams.get('sortOrder') || '') ? searchParams.get('sortOrder') : 'desc';

  const { data, isLoading } = useGetRoles({ page: Number(page), limit: Number(pageSize), search: search });


  const [selectedRoles, setSelectedRoles] = useState<IRole[]>([]);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IRole>>({
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

  const handleSortStatusChange = (status: DataTableSortStatus<IRole>) => {
    handleChangePage(1);
    setSortStatus?.(status);
  };

  const columns: DataTableColumn<IRole>[] = [
    {
      accessor: 'title',
      title: 'Title',
      ellipsis: true,
      sortable: true,
      render: ({ name }) => {
        return (
          <Text c='primary'>{name || '-'}</Text>
        );
      },
    },
    {
      accessor: '_id',
      title: 'Action',
      width: 200,
      render: () => {
        return (
          <ActionIcon variant="outline" aria-label="Edit">
            <IconEdit />
          </ActionIcon>
        );
      },
    },
  ]
  return (
    <DataTable
      idAccessor='_id'
      highlightOnHover
      records={data?.data?.roleData}
      fetching={isLoading}
      selectedRecords={selectedRoles}
      onSelectedRecordsChange={setSelectedRoles}
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
  )
}
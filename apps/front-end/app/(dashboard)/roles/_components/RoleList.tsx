'use client'
import { useGetRoles } from '@/libs/react-query-hooks/src/lib/role'
import { FilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { IRole } from '@agent-xenon/interfaces';
import { Anchor, Text } from '@mantine/core';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable'
import Link from 'next/link';
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
      accessor: 'name',
      title: 'Role Name',
      ellipsis: true,
      sortable: true,
      width: 220,
      render: ({ name, _id }) => {
        return (
          <Anchor component={Link} href={`/roles/${_id}`} style={{ position: 'relative' }}>{name || '-'}</Anchor>
        );
      },
    },
    {
      accessor: 'type',
      title: 'Type',
      ellipsis: true,
      sortable: true,
      width: 220,
      render: ({ type }) => {
        return (
          <Text c='primary'>{type || '-'}</Text>
        );
      },
    },
    {
      accessor: 'permissions',
      title: 'Permissions',
      ellipsis: true,
      sortable: true,
      render: ({ permissions }) => <Text>{permissions?.length || 0}</Text>,
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
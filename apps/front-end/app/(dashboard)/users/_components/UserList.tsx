'use client'
import { useGetUsers } from '@/libs/react-query-hooks/src/lib/user/useGetUsers';
import { FilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { IUser } from '@agent-xenon/interfaces';
import { Anchor, Text } from '@mantine/core';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable'
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

const PAGE_SIZES = [50, 100, 200, 500, 1000];
const SORT_ORDER = ['asc', 'desc'];

export const UserList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || PAGE_SIZES[0];
  const search = searchParams.get('search') || ''
  const sortColumn = searchParams.get('sortColumn') || 'lastUpdatedDate';
  const sortOrder = SORT_ORDER.includes(searchParams.get('sortOrder') || '') ? searchParams.get('sortOrder') : 'desc';

  const { data, isLoading } = useGetUsers({ page: Number(page), limit: Number(pageSize), search: search });


  const [selectedRoles, setSelectedRoles] = useState<IUser[]>([]);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IUser>>({
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

  const handleSortStatusChange = (status: DataTableSortStatus<IUser>) => {
    handleChangePage(1);
    setSortStatus?.(status);
  };

  const columns: DataTableColumn<IUser>[] = [
    {
      accessor: 'firstName',
      title: 'Name',
      ellipsis: true,
      sortable: true,
      width: 'auto',
      render: ({ firstName, lastName, _id }) => {
        return (
          <Anchor component={Link} href={`/users/${_id}`} style={{ position: 'relative' }}>{`${firstName} ${lastName}`}</Anchor>
        );
      },
    },
    {
      accessor: 'email',
      title: 'Email',
      ellipsis: true,
      sortable: true,
      width: 'auto',
      render: ({ email }) => {
        return (
          <Text c='primary'>{email || '-'}</Text>
        );
      },
    },
    {
      accessor: 'role',
      title: 'Role',
      ellipsis: true,
      sortable: true,
      width: 'auto',
      render: ({ role }) => <Text>{role?.name}</Text>,
    },
  ]
  return (
    <DataTable
      idAccessor='_id'
      highlightOnHover
      records={data?.data?.userData}
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
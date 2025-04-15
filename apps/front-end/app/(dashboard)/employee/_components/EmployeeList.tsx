'use client'
import { FilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { ActionIcon, Anchor } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable'
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { usePermissions } from '@/libs/hooks/usePermissions';
import { useGetEmployees, useDeleteEmployees } from '@agent-xenon/react-query-hooks';
import { IEmployee } from '@agent-xenon/interfaces';
import { useConfirmDelete } from '@/libs/hooks/useConfirmDelete';

const PAGE_SIZES = [50, 100, 200, 500, 1000];
const SORT_ORDER = ['asc', 'desc'];

export const EmployeeList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || PAGE_SIZES[0];
  const search = searchParams.get('search') || ''
  const sortColumn = searchParams.get('sortColumn') || 'lastUpdatedDate';
  const sortOrder = SORT_ORDER.includes(searchParams.get('sortOrder') || '') ? searchParams.get('sortOrder') : 'desc';

  const { data: getEmployeesResponse, isLoading, refetch } = useGetEmployees({ page: Number(page), limit: Number(pageSize), search: search });
  const [selectedEmployees, setSelectedEmployees] = useState<IEmployee[]>([]);
  const { deleteEmployeesMutation } = useDeleteEmployees();
  const permission = usePermissions()
  const employees = getEmployeesResponse?.data?.employees || [];
  const confirmDelete = useConfirmDelete();

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IEmployee>>({
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

  const handleSortStatusChange = (status: DataTableSortStatus<IEmployee>) => {
    handleChangePage(1);
    setSortStatus?.(status);
  };

  const columns: DataTableColumn<IEmployee>[] = [
    {
      accessor: 'fullName',
      title: 'Employee Name',
      ellipsis: true,
      sortable: true,
      width: 250,
      render: ({ firstName, lastName, _id }) => (
        <Anchor component={Link} href={`/employee/${_id}`} style={{ position: 'relative' }}>
          {firstName || lastName ? `${firstName} ${lastName}` : '-'}
        </Anchor>
      ),
    },
    {
      accessor: 'contactInfo.email',
      title: 'Email',
      ellipsis: true,
      sortable: true,
      render: ({ contactInfo }) => contactInfo?.email || '-',
    },
    {
      accessor: 'contactInfo.phoneNumber',
      title: 'Phone',
      ellipsis: true,
      sortable: true,
      render: ({ contactInfo }) => contactInfo?.phoneNumber || '-',
    },
    {
      accessor: 'designation.name',
      title: 'Designation',
      ellipsis: true,
      sortable: true,
      render: ({ designation }) => designation?.name || '-',
    },
    {
      accessor: 'jobRole.name',
      title: 'Job Role',
      ellipsis: true,
      sortable: true,
      render: ({ jobRole }) => jobRole?.name || '-',
    },
    {
      accessor: 'joinDate',
      title: 'Join Date',
      ellipsis: true,
      sortable: true,
      render: ({ joinDate }) => new Date(joinDate).toLocaleDateString(),
    },
  ];

  const handleDeleteSelected = () => {
    const employeeIds = selectedEmployees.map((role) => String(role._id));

    confirmDelete({
      itemName: employeeIds.length > 1 ? 'these employees' : 'this employee',
      onConfirm: () => {
        deleteEmployeesMutation.mutate(
          { employeeIds },
          {
            onSuccess: () => {
              refetch();
              setSelectedEmployees([]);
            },
          }
        );
      },
    });
  };


  return (
    <React.Fragment>
      {
        permission?.hasEmployeeDelete && selectedEmployees.length > 0 &&
        <ActionIcon color='red' onClick={handleDeleteSelected}>
          <IconTrash size="1.5rem" />
        </ActionIcon>
      }
      <DataTable
        idAccessor='_id'
        highlightOnHover
        records={employees}
        fetching={isLoading}
        selectedRecords={selectedEmployees}
        onSelectedRecordsChange={setSelectedEmployees}
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
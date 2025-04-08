'use client'
import { FilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { ActionIcon, Anchor } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable'
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { usePermissions } from '@/libs/hooks/usePermissions';
import { useGetDesignations, useDeleteDesignations } from '@agent-xenon/react-query-hooks';
import { IDesignation } from '@agent-xenon/interfaces';
import { useConfirmDelete } from '@/libs/hooks/useConfirmDelete';

const PAGE_SIZES = [50, 100, 200, 500, 1000];
const SORT_ORDER = ['asc', 'desc'];

export const DesignationList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || PAGE_SIZES[0];
  const search = searchParams.get('search') || ''
  const sortColumn = searchParams.get('sortColumn') || 'lastUpdatedDate';
  const sortOrder = SORT_ORDER.includes(searchParams.get('sortOrder') || '') ? searchParams.get('sortOrder') : 'desc';

  const { data: getDesignationsResponse, isLoading, refetch } = useGetDesignations({ page: Number(page), limit: Number(pageSize), search: search });
  const [selectedDesignations, setSelectedDesignations] = useState<IDesignation[]>([]);
  const { deleteDesignationsMutation } = useDeleteDesignations();
  const permission = usePermissions()
  const designations = getDesignationsResponse?.data?.designations || [];
  const confirmDelete = useConfirmDelete();

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IDesignation>>({
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

  const handleSortStatusChange = (status: DataTableSortStatus<IDesignation>) => {
    handleChangePage(1);
    setSortStatus?.(status);
  };

  const columns: DataTableColumn<IDesignation>[] = [
    {
      accessor: 'name',
      title: 'Designation',
      ellipsis: true,
      sortable: true,
      width: 325,
      render: ({ name, _id }) => {
        return (
          <Anchor component={Link} href={`/designation/${_id}`} style={{ position: 'relative' }}>{name || '-'}</Anchor>
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
    const designationIds = selectedDesignations.map((role) => String(role._id));

    confirmDelete({
      itemName: designationIds.length > 1 ? 'these designations' : 'this designation',
      onConfirm: () => {
        deleteDesignationsMutation.mutate(
          { designationIds },
          {
            onSuccess: () => {
              refetch();
              setSelectedDesignations([]);
            },
          }
        );
      },
    });
  };


  return (
    <React.Fragment>
      {
        permission?.hasDesignationDelete && selectedDesignations.length > 0 &&
        <ActionIcon color='red' onClick={handleDeleteSelected}>
          <IconTrash size="1.5rem" />
        </ActionIcon>
      }
      <DataTable
        idAccessor='_id'
        highlightOnHover
        records={designations}
        fetching={isLoading}
        selectedRecords={selectedDesignations}
        onSelectedRecordsChange={setSelectedDesignations}
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
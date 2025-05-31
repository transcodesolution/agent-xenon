'use client'
import { FilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { ActionIcon, Anchor } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable'
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { usePermissions } from '@/libs/hooks/usePermissions';
import { ITraining } from '@agent-xenon/interfaces';
import { useConfirmDelete } from '@/libs/hooks/useConfirmDelete';
import { useGetTrainings, useDeleteTrainings } from '@agent-xenon/react-query-hooks';

const PAGE_SIZES = [50, 100, 200, 500, 1000];
const SORT_ORDER = ['asc', 'desc'];

export const TrainingList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || PAGE_SIZES[0];
  const search = searchParams.get('search') || ''
  const sortColumn = searchParams.get('sortColumn') || 'lastUpdatedDate';
  const sortOrder = SORT_ORDER.includes(searchParams.get('sortOrder') || '') ? searchParams.get('sortOrder') : 'desc';

  const { data: getTrainingsResponse, isLoading, refetch } = useGetTrainings({ page: Number(page), limit: Number(pageSize), search: search });
  const [selectedTrainings, setSelectedTrainings] = useState<ITraining[]>([]);
  const { deleteTrainingsMutation } = useDeleteTrainings();
  const permission = usePermissions()
  const trainings = getTrainingsResponse?.data?.trainings || [];
  const confirmDelete = useConfirmDelete();

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<ITraining>>({
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

  const handleSortStatusChange = (status: DataTableSortStatus<ITraining>) => {
    handleChangePage(1);
    setSortStatus?.(status);
  };

  const columns: DataTableColumn<ITraining>[] = [
    {
      accessor: 'title',
      title: 'Title',
      ellipsis: true,
      sortable: true,
      width: 300,
      render: ({ name, _id }) => (
        <Anchor component={Link} href={`/trainings/${_id}`}>{name || '-'}</Anchor>
      ),
    },
    {
      accessor: 'description',
      title: 'Description',
      ellipsis: true,
      sortable: false,
    },
    {
      accessor: 'level',
      title: 'Level',
      sortable: true,
      render: ({ level }) => {
        return typeof level === 'string'
          ? level.charAt(0).toUpperCase() + level.slice(1)
          : '-';
      },
    }
  ];

  const handleDeleteSelected = () => {
    const trainingIds = selectedTrainings.map((role) => String(role._id));

    confirmDelete({
      itemName: trainingIds.length > 1 ? 'these trainings' : 'this training',
      onConfirm: () => {
        deleteTrainingsMutation.mutate(
          { trainingIds },
          {
            onSuccess: () => {
              refetch();
              setSelectedTrainings([]);
            },
          }
        );
      },
    });
  };


  return (
    <React.Fragment>
      {
        permission?.hasTrainingDelete && selectedTrainings.length > 0 &&
        <ActionIcon color='red' onClick={handleDeleteSelected}>
          <IconTrash size="1.5rem" />
        </ActionIcon>
      }
      <DataTable
        idAccessor='_id'
        highlightOnHover
        records={trainings}
        fetching={isLoading}
        selectedRecords={selectedTrainings}
        onSelectedRecordsChange={setSelectedTrainings}
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
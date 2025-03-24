import { FilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { DataTable, DataTableSortStatus } from 'mantine-datatable'
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { IJob } from '@agent-xenon/interfaces';
import { getColumns } from './Columns';
import { ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { usePermissions } from '@/libs/hooks/usePermissions';

const PAGE_SIZES = [50, 100, 200, 500, 1000];
const SORT_ORDER = ['asc', 'desc'];

interface IJobLists {
  data: IJob[];
  isFetching: boolean;
  onDelete: (jobIds: string[]) => void;
}

export function JobLists({ data, isFetching, onDelete }: IJobLists) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedJobs, setSelectedJobs] = useState<IJob[]>([]);
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || PAGE_SIZES[0];
  const sortColumn = searchParams.get('sortColumn') || 'lastUpdatedDate';
  const sortOrder = SORT_ORDER.includes(searchParams.get('sortOrder') || '')
    ? searchParams.get('sortOrder')
    : 'desc';

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IJob>>({
    columnAccessor: sortColumn,
    direction: sortOrder as 'asc' | 'desc',
  });
  const columns = getColumns(sortStatus);
  const permission = usePermissions()

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
  const handleSortStatusChange = (status: DataTableSortStatus<IJob>) => {
    handleChangePage(1);
    setSortStatus?.(status);
  };

  const handleDeleteSelected = () => {
    const jobIds = selectedJobs.map((job) => String(job._id));
    onDelete?.(jobIds);
    setSelectedJobs([])
  };

  return (
    <React.Fragment>
      {permission?.hasJobDelete && selectedJobs.length > 0 &&
        <ActionIcon color='red' onClick={handleDeleteSelected}>
          <IconTrash size="1.5rem" />
        </ActionIcon>
      }
      <DataTable
        idAccessor='_id'
        highlightOnHover
        records={data}
        fetching={isFetching}
        selectedRecords={selectedJobs}
        onSelectedRecordsChange={setSelectedJobs}
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
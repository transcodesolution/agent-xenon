import { FilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { DataTable, DataTableSortStatus } from 'mantine-datatable'
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { IJob } from '@agent-xenon/interfaces';
import { getColumns } from './Columns';
const PAGE_SIZES = [50, 100, 200, 500, 1000];
const SORT_ORDER = ['asc', 'desc'];

interface JobListsProps {
  data: IJob[];
  isFetching:boolean
}

export function JobLists({ data,isFetching }: JobListsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

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

  const columns = getColumns(sortStatus);

  return (
    <DataTable
      idAccessor='_id'
      highlightOnHover
      records={data}
      fetching={isFetching}
      selectedRecords={[]}
      page={page}
      onPageChange={handleChangePage}
      onSelectedRecordsChange={() => console.log('selected')}
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


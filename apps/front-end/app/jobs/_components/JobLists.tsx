'use client'
import { FilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable'
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { IJob } from '@agent-xenon/interfaces';
import { JobStatus } from '@agent-xenon/constants';
const PAGE_SIZES = [50, 100, 200, 500, 1000];
const SORT_ORDER = ['asc', 'desc'];

export const JobLists = () => {
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
    router.push(`?${newSearchParams.toString()}`);
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


  const columns: DataTableColumn<IJob>[] = [
    {
      accessor: '_id',
      title: '',
      render: (data, index) => {
        return index + 1
      },
      width: 25
    },
    {
      accessor: 'title',
      title: 'Title',
      ellipsis: true,
      sortable: true,
    }
  ]

  const data: IJob[] = [
    {
      _id: '1',
      title: 'Senior Software Engineer',
      description: 'Responsible for developing and maintaining web applications.',
      role: 'Developer',
      status: JobStatus.OPEN,
      designation: 'Senior Engineer',
      qualificationCriteria: '5+ years of experience in software development',
      organizationId: 'org1',
      createdAt: new Date(),
      updatedAt: new Date(),
      rounds: [
        {
          _id: 'round1',
          type: 'Technical',
          durationInSeconds: 3600,
          qualificationCriteria: 'Pass technical test',
          roundNumber: 1,
        },
      ],
    },
    {
      _id: '2',
      title: 'Junior Software Engineer',
      description: 'Assist in the development and maintenance of web applications.',
      role: 'Developer',
      status: JobStatus.OPEN,
      designation: 'Junior Engineer',
      qualificationCriteria: '1+ years of experience in software development',
      organizationId: 'org2',
      createdAt: new Date(),
      updatedAt: new Date(),
      rounds: [
        {
          _id: 'round2',
          type: 'Technical',
          durationInSeconds: 1800,
          qualificationCriteria: 'Pass technical test',
          roundNumber: 1,
        },
      ],
    },
    {
      _id: '3',
      title: 'Senior Business Executive',
      description: 'Responsible for business development and client relations.',
      role: 'Business',
      status: JobStatus.OPEN,
      designation: 'Senior Executive',
      qualificationCriteria: '5+ years of experience in business development',
      organizationId: 'org3',
      createdAt: new Date(),
      updatedAt: new Date(),
      rounds: [
        {
          _id: 'round3',
          type: 'HR',
          durationInSeconds: 3600,
          qualificationCriteria: 'Pass HR interview',
          roundNumber: 1,
        },
      ],
    }
  ];


  return (
    <DataTable
      idAccessor='_id'
      highlightOnHover
      records={data}
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


'use client'
import { useDeleteQuestions, useGetMCQQuestions } from '@agent-xenon/react-query-hooks';
import { FilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { IInterviewQuestionAnswer } from '@agent-xenon/interfaces';
import { ActionIcon, Anchor, Text } from '@mantine/core';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable'
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { IconTrash } from '@tabler/icons-react';

const PAGE_SIZES = [50, 100, 200, 500, 1000];
const SORT_ORDER = ['asc', 'desc'];

export const QuestionList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || PAGE_SIZES[0];
  const search = searchParams.get('search') || ''
  const sortColumn = searchParams.get('sortColumn') || 'lastUpdatedDate';
  const sortOrder = SORT_ORDER.includes(searchParams.get('sortOrder') || '') ? searchParams.get('sortOrder') : 'desc';

  const { data, isLoading, refetch } = useGetMCQQuestions({ page: Number(page), limit: Number(pageSize), search: search });
  const [selectedQuestions, setSelectedQuestions] = useState<IInterviewQuestionAnswer[]>([]);
  const { deleteQuestionsMutation } = useDeleteQuestions();

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IInterviewQuestionAnswer>>({
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

  const handleSortStatusChange = (status: DataTableSortStatus<IInterviewQuestionAnswer>) => {
    handleChangePage(1);
    setSortStatus?.(status);
  };

  const columns: DataTableColumn<IInterviewQuestionAnswer>[] = [
    {
      accessor: 'question',
      title: 'Questions',
      ellipsis: true,
      sortable: true,
      render: ({ question, _id }) => {
        return (
          <Anchor component={Link} href={`/questions/${_id}`} style={{ position: 'relative' }}>{question || '-'}</Anchor>
        );
      },
    },
    {
      accessor: 'type',
      title: 'Type',
      ellipsis: true,
      sortable: true,
      render: ({ type }) => {
        return (
          <Text c='primary'>{type || 'custom'}</Text>
        );
      },
    },
  ]

  const handleDeleteSelected = () => {
    const questionIds = selectedQuestions.map((question) => String(question._id));
    deleteQuestionsMutation.mutate(
      { questionIds },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
    setSelectedQuestions([])
  };

  return (
    <React.Fragment>
      {selectedQuestions.length > 0 &&
        <ActionIcon color='red' onClick={handleDeleteSelected}>
          <IconTrash size="1.5rem" />
        </ActionIcon>
      }
      <DataTable
        idAccessor='_id'
        highlightOnHover
        records={data?.data?.questions}
        fetching={isLoading}
        selectedRecords={selectedQuestions}
        onSelectedRecordsChange={setSelectedQuestions}
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
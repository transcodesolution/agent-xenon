import { useRouter, useSearchParams } from 'next/navigation'
import { CloseButton, Flex, Input, SegmentedControl, VisuallyHidden } from '@mantine/core'
import React, { useRef } from 'react'
import { IconLayoutGrid, IconList } from '@tabler/icons-react'
import { FilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams'

export const JobFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const iconProps = {
    style: { display: 'block' },
    size: 20,
    stroke: 1.5,
  };

  const search = searchParams.get('search');
  const view = searchParams.get('view') || 'list';

  const handleApplyFilter = (filters: FilterParams) => {
    const newSearchParams = updateUrlParams(filters)
    router.push(`${newSearchParams.toString()}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleApplyFilter({ 'search': searchInputRef.current?.value });
    }
  };

  return (
    <Flex align='center' justify='space-between'>
      <Input
        ref={searchInputRef}
        placeholder="Search Job"
        onKeyDown={handleKeyDown}
        rightSectionPointerEvents="all"
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={() => {
              handleApplyFilter({ 'search': undefined });
              if (searchInputRef.current) {
                searchInputRef.current.value = ''
              }
            }}
            style={{ display: search ? undefined : 'none' }}
          />
        }
      />
      <SegmentedControl
        data={[
          {
            value: 'list',
            label: (
              <React.Fragment>
                <IconList {...iconProps} />
                <VisuallyHidden>List</VisuallyHidden>
              </React.Fragment>
            ),
          },
          {
            value: 'grid',
            label: (
              <React.Fragment>
                <IconLayoutGrid {...iconProps} />
                <VisuallyHidden>Grid</VisuallyHidden>
              </React.Fragment>
            ),
          },
        ]}
        value={view}
        onChange={(value) => handleApplyFilter({ 'view': value })}
      />
    </Flex>
  )
}
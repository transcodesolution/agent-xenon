import React from 'react';
import { RoleFilter } from './_components/RoleFilter';
import { RoleList } from './_components/RoleList';

export default function Page() {

  return (
    <React.Fragment>
      <RoleFilter />
      <RoleList />
    </React.Fragment>
  )
}
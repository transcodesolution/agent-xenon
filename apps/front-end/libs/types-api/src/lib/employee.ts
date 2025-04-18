import { IEmployee } from "@agent-xenon/interfaces";

export interface IGetEmployeeRequest {
  page: number;
  limit: number;
  search: string;
}

export interface IGetUnassignedEmployeesRequest {
  trainingId: string;
  search: string;
}

export interface IAssignedEmployees {
  firstName: string;
  _id: string;
  id: string;
  lastName: string;
}

export interface IGetUnassignedEmployeesResponse {
  employees: IAssignedEmployees[]
}
'use client';
import {
  TextInput,
  Stack,
  LoadingOverlay,
  Grid,
  Title,
  Divider,
  Select,
  Textarea,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useParams } from 'next/navigation';
import { showNotification } from "@mantine/notifications";
import { usePermissions } from "@/libs/hooks/usePermissions";
import { useGetEmployeeById, useJobRoleAndDesignation, useUpdateEmployee } from "@agent-xenon/react-query-hooks";
import { useDebouncedCallback } from "@mantine/hooks";
import { DatePickerInput } from "@mantine/dates";
import { EditableInput } from "@/libs/components/custom/input/EditableInput";
import { useEffect, useState } from "react";

export const EmployeeDetails = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { data: getEmployeeByIdResponse, isLoading } = useGetEmployeeById({ employeeId });
  const { mutate: updateEmployee } = useUpdateEmployee();
  const permission = usePermissions();
  const employee = getEmployeeByIdResponse?.data;
  const { data: jobRoleAndDesignationResponse } = useJobRoleAndDesignation();
  const jobRoleAndDesignation = jobRoleAndDesignationResponse?.data
  const [joinDate, setJoinDate] = useState<Date | null>(employee?.joinDate ? new Date(employee.joinDate) : new Date());

  const designationsOptions =
    jobRoleAndDesignation?.designations.map((designation) => ({
      value: designation._id,
      label: designation.name,
    })) || [];

  const rolesOptions =
    jobRoleAndDesignation?.jobRoles.map((role) => ({
      value: role._id,
      label: role.name,
    })) || [];

  useEffect(() => {
    if (employee?.joinDate) {
      setJoinDate(new Date(employee.joinDate));
    }
  }, [employee]);

  const debouncedUpdate = useDebouncedCallback((field: string, value: any) => {
    updateEmployee(
      {
        _id: employeeId,
        [field]: value,
      },
      {
        onError: (error) => {
          showNotification({
            title: "Update Failed",
            message: error.message,
            color: "red",
            icon: <IconX size={16} />,
          });
        },
      }
    );
  }, 600);

  const handleChange = (field: string, value: any) => {
    if (!permission?.hasEmployeeUpdate) {
      showNotification({
        message: "You do not have permission to update employee",
        color: 'red',
      });
      return;
    }

    debouncedUpdate(field, value);
  };

  const salary = employee?.salaryDetail;

  return (
    <Stack gap="xs">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      {/* Personal & Contact Info */}
      <Title order={4}>Employee Details</Title>
      <Grid gutter="md" mt='md'>
        <Grid.Col span={6}>
          <TextInput
            label="First Name"
            defaultValue={employee?.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Last Name"
            defaultValue={employee?.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Designation"
            data={designationsOptions}
            value={employee?.designation?._id}
            onChange={(val) => handleChange('designationId', val)}
            w='100%'
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Role"
            data={rolesOptions}
            value={employee?.jobRole?._id}
            onChange={(val) => handleChange('jobRoleId', val)}
            w='100%'
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <DatePickerInput
            label="Join Date"
            value={joinDate}
            onChange={(date) => {
              setJoinDate(date);
              handleChange("joinDate", date);
            }}
            clearable={false}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <EditableInput
            label="Password"
            currentValue={employee?.password || ""}
            type="password"
            onSave={(val) => handleChange("password", val)}
          />
        </Grid.Col>
      </Grid>
      <Divider label="Contact Information" my='md' />
      <Grid gutter="md">
        <Grid.Col span={6}>
          <EditableInput
            label="Email"
            currentValue={employee?.contactInfo?.email || ""}
            onSave={(val) => handleChange("contactInfo.email", val)}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label="Phone Number"
            defaultValue={employee?.contactInfo?.phoneNumber || ""}
            onChange={(e) => handleChange("contactInfo.phoneNumber", e.target.value)}
            autoFocus={false}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            label="Address"
            defaultValue={employee?.contactInfo?.address || ""}
            onChange={(e) => handleChange("contactInfo.address", e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="City"
            defaultValue={employee?.contactInfo?.city || ""}
            onChange={(e) => handleChange("contactInfo.city", e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="State"
            defaultValue={employee?.contactInfo?.state || ""}
            onChange={(e) => handleChange("contactInfo.state", e.target.value)}
          />
        </Grid.Col>
      </Grid>
      {/* Salary Info */}
      <Divider label="Salary Details" my='md' />

      <Title order={5} >Allowances</Title>
      <Grid gutter="sm">
        <Grid.Col span={4}>
          <TextInput
            label="Core Compensation"
            type="number"
            defaultValue={salary?.allowances?.coreCompensation || ''}
            onChange={(e) => handleChange('salaryDetail.allowances.coreCompensation', +e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="House Living Benefits"
            type="number"
            defaultValue={salary?.allowances?.houseLivingBenefits || ''}
            onChange={(e) => handleChange('salaryDetail.allowances.houseLivingBenefits', +e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Incentive Performance Benefits"
            type="number"
            defaultValue={salary?.allowances?.incentivePerformanceBenefits || ''}
            onChange={(e) => handleChange('salaryDetail.allowances.incentivePerformanceBenefits', +e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Retirement Benefits"
            type="number"
            defaultValue={salary?.allowances?.retirementBenefits || ''}
            onChange={(e) => handleChange('salaryDetail.allowances.retirementBenefits', +e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Transportation Benefits"
            type="number"
            defaultValue={salary?.allowances?.transportationMobilityBenefits || ''}
            onChange={(e) => handleChange('salaryDetail.allowances.transportationMobilityBenefits', +e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Work-Related Benefits"
            type="number"
            defaultValue={salary?.allowances?.workRelatedBenefits || ''}
            onChange={(e) => handleChange('salaryDetail.allowances.workRelatedBenefits', +e.target.value)}
          />
        </Grid.Col>
      </Grid>

      <Title order={5}>Deductions</Title>
      <Grid gutter="sm">
        <Grid.Col span={4}>
          <TextInput
            label="Mandatory Deductions"
            type="number"
            defaultValue={salary?.deductions?.mandatory || ''}
            onChange={(e) => handleChange('salaryDetail.deductions.mandatory', +e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Optional Deductions"
            type="number"
            defaultValue={salary?.deductions?.optional || ''}
            onChange={(e) => handleChange('salaryDetail.deductions.optional', +e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Voluntary Deductions"
            type="number"
            defaultValue={salary?.deductions?.voluntary || ''}
            onChange={(e) => handleChange('salaryDetail.deductions.voluntary', +e.target.value)}
          />
        </Grid.Col>
      </Grid>

      <Title order={5}>Basic Salary Details</Title>
      <Grid gutter="sm">
        <Grid.Col span={4}>
          <TextInput
            label="Gross Salary"
            type="number"
            defaultValue={salary?.grossSalary || ''}
            onChange={(e) => handleChange('salaryDetail.grossSalary', +e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Net Salary"
            type="number"
            defaultValue={salary?.netSalary || ''}
            onChange={(e) => handleChange('salaryDetail.netSalary', +e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Total Cost To Company (CTC)"
            type="number"
            defaultValue={salary?.totalCostToCompany || ''}
            onChange={(e) => handleChange('salaryDetail.totalCostToCompany', +e.target.value)}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

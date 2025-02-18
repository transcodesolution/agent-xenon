import { JobForm } from "./_components/JobForm"

const designations = [{ value: 'senior', label: 'Senior' }, { value: 'junior', label: 'Junior' }]
const roles = [{ value: 'softwareEngineer', label: 'Software Engineer' }, { value: 'webDesigner', label: 'Web Designer' }]

export default function page() {
  return (
    <JobForm designations={designations} roles={roles} />
  )
}

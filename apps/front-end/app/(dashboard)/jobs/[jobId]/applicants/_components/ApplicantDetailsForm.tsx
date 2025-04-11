import { TextInput, Button, Grid, Group, TagsInput, Flex, Text, ActionIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from './ApplicantDetailsForm.module.css'
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { IEducation, IExperienceDetail, IProject } from '@agent-xenon/interfaces';
import { useCreateJobApplicant, useGetApplicantById } from '@agent-xenon/react-query-hooks';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useUpdateJobApplicant } from '@/libs/react-query-hooks/src/lib/applicant/useUpdateJobApplicant';
import { showNotification } from '@mantine/notifications';

export function ApplicantDetailsForm({ refetch, onClose, applicantId }: { refetch: () => void, onClose: () => void, applicantId: string }) {
  const { jobId } = useParams<{ jobId: string }>();
  const { mutate: createJobApplicant } = useCreateJobApplicant();
  const { mutate: updateJobApplicant } = useUpdateJobApplicant();
  const { data: getApplicantByIdResponse } = useGetApplicantById({ applicantId });
  const applicant = getApplicantByIdResponse?.data;

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      password: '',
      contactInfo: {
        address: '',
        city: '',
        state: '',
        email: '',
        phoneNumber: '',
      },
      skills: [] as string[],
      hobbies: [] as string[],
      strengths: [] as string[],
      experienceDetails: [{ durationStart: new Date(), durationEnd: new Date(), responsibilities: '', role: '', organization: '' }],
      projects: [{ title: '', durationStart: new Date(), durationEnd: new Date(), technologiesUsed: [] as string[], description: '' }],
      education: [{ degree: '', institution: '', yearOfGraduation: '', description: '' }],
      socialLinks: { name: '', link: '' }
    },
    validate: {
      firstName: (value: string) => (value.length === 0 ? 'First name is required' : null),
      lastName: (value: string) => (value.length === 0 ? 'Last name is required' : null),
      password: (value: string) =>
        value.length < 8 ? 'Password must be at least 8 characters' : null,
      contactInfo: {
        email: (value: string) =>
          value.length === 0 ? 'Email is required' : /^\S+@\S+$/.test(value) ? null : 'Invalid email address',
        phoneNumber: (value: string) => (value.length === 0 ? 'Phone number is required' : null),
        address: (value: string) => (value.length === 0 ? 'Address is required' : null),
        city: (value: string) => (value.length === 0 ? 'City is required' : null),
        state: (value: string) => (value.length === 0 ? 'State is required' : null),
      },
    },
  });

  useEffect(() => {
    if (applicant) {
      const socialLinksObj = applicant?.socialLinks as Record<string, string> || {};
      const socialLinkName = socialLinksObj ? Object.keys(socialLinksObj)[0] || '' : '';
      const socialLinkValue = socialLinksObj ? socialLinksObj[socialLinkName] || '' : '';

      form.setValues({
        firstName: applicant?.firstName || '',
        lastName: applicant?.lastName || '',
        password: applicant?.password || '',
        contactInfo: {
          address: applicant?.contactInfo?.address || '',
          city: applicant?.contactInfo?.city || '',
          state: applicant?.contactInfo?.state || '',
          email: applicant?.contactInfo?.email || '',
          phoneNumber: applicant?.contactInfo?.phoneNumber || '',
        },
        skills: Array.isArray(applicant?.skills) ? applicant.skills : [],
        hobbies: Array.isArray(applicant?.hobbies) ? applicant.hobbies : [],
        strengths: Array.isArray(applicant?.strengths) ? applicant.strengths : [],
        experienceDetails: Array.isArray(applicant?.experienceDetails)
          ? applicant.experienceDetails.map(experience => ({
            ...experience,
            durationStart: experience.durationStart ? new Date(experience.durationStart) : new Date(),
            durationEnd: experience.durationEnd ? new Date(experience.durationEnd) : new Date(),
          }))
          : [{ durationStart: new Date(), durationEnd: new Date(), responsibilities: '', role: '', organization: '' }],
        education: Array.isArray(applicant?.education)
          ? applicant.education
          : [{ degree: '', institution: '', yearOfGraduation: '', description: '' }],
        projects: Array.isArray(applicant?.projects) && applicant.projects.length > 0
          ? applicant.projects.map(project => ({
            ...project,
            durationStart: project.durationStart ? new Date(project.durationStart) : new Date(),
            durationEnd: project.durationEnd ? new Date(project.durationEnd) : new Date(),
            technologiesUsed: Array.isArray(project.technologiesUsed) ? project.technologiesUsed : [],
          }))
          : [{ title: '', durationStart: new Date(), durationEnd: new Date(), technologiesUsed: [], description: '' }],
        socialLinks: Object.keys(socialLinksObj).length > 0
          ? { name: socialLinkName, link: socialLinkValue }
          : { name: '', link: '' },
      });
    }
  }, [applicant]);

  const handleAddProject = (index: number) => {
    const newProject = {
      title: form.values.projects[index].title,
      durationStart: form.values.projects[index].durationStart,
      durationEnd: form.values.projects[index].durationEnd,
      technologiesUsed: form.values.projects[index].technologiesUsed,
      description: form.values.projects[index].description,
    };

    if (!newProject.title || !newProject.durationStart || !newProject.durationEnd || !newProject.description) {
      console.log("Please fill in all project fields.");
      return;
    }
    const updatedProjects = [...form.values.projects];
    updatedProjects.splice(index + 1, 0, { title: '', durationStart: new Date(), durationEnd: new Date(), technologiesUsed: [], description: '' });
    form.setFieldValue('projects', updatedProjects);
  };

  const handleDeleteProject = (index: number) => {
    const updatedProjects = form.values.projects.filter((_, i) => i !== index);
    form.setFieldValue('projects', updatedProjects);
  };

  const handleAddEducation = (index: number) => {
    const newEducation = form.values.education[index];

    if (!newEducation.degree || !newEducation.institution || !newEducation.yearOfGraduation || !newEducation.description) {
      console.log("Please fill in all education fields.");
      return;
    }

    const updatedEducation = [...form.values.education];
    updatedEducation.splice(index + 1, 0, { degree: '', institution: '', yearOfGraduation: '', description: '' });
    form.setFieldValue('education', updatedEducation);
  };

  const handleDeleteEducation = (index: number) => {
    const updatedEducation = form.values.education.filter((_, i) => i !== index);
    form.setFieldValue('education', updatedEducation);
  };

  const handleAddExperience = (index: number) => {
    const newExperience = form.values.experienceDetails[index];

    if (!newExperience.durationStart || !newExperience.durationEnd || !newExperience.role || !newExperience.organization) {
      console.log("Please fill in all experience fields.");
      return;
    }
    const updatedExperience = [...form.values.experienceDetails];
    updatedExperience.splice(index + 1, 0, { durationStart: new Date(), durationEnd: new Date(), responsibilities: '', role: '', organization: '' });
    form.setFieldValue('experienceDetails', updatedExperience);
  };

  const handleDeleteExperience = (index: number) => {
    const updatedExperience = form.values.experienceDetails.filter((_, i) => i !== index);
    form.setFieldValue('experienceDetails', updatedExperience);
  };

  const isProjectComplete = (project: IProject) => {
    return (
      project.title &&
      project.durationStart &&
      project.durationEnd &&
      project.description
    );
  };

  const isEducationComplete = (education: IEducation) => {
    return (
      education.degree &&
      education.institution &&
      education.yearOfGraduation &&
      education.description
    );
  };

  const isExperienceComplete = (experience: IExperienceDetail) => {
    return (
      experience.durationStart &&
      experience.durationEnd &&
      experience.role &&
      experience.organization
    );
  };

  const handleSubmit = () => {
    const socialLinks = form.values.socialLinks.name
      ? { [form.values.socialLinks.name]: form.values.socialLinks.link }
      : {};
    const formData = {
      firstName: form.values.firstName,
      lastName: form.values.lastName,
      password: form.values.password,
      contactInfo: form.values.contactInfo,
      skills: form.values.skills,
      hobbies: form.values.hobbies,
      strengths: form.values.strengths,
      projects: form.values.projects.map(project => ({
        title: project.title,
        durationStart: project.durationStart,
        durationEnd: project.durationEnd,
        technologiesUsed: project.technologiesUsed,
        description: project.description,
      })),
      education: form.values.education,
      experienceDetails: form.values.experienceDetails.map(experience => ({
        durationStart: experience.durationStart,
        durationEnd: experience.durationEnd,
        responsibilities: experience.responsibilities,
        role: experience.role,
        organization: experience.organization,
      })),
      jobId: jobId,
      socialLinks
    };
    console.log('Submitting to API:', formData);
    if (applicantId) {
      updateJobApplicant({ _id: applicantId, ...formData }, {
        onSuccess: (response) => {
          showNotification({
            message: response.message,
            color: 'green'
          });
          onClose?.();
          refetch?.();
        },
        onError: (error) => {
          console.log('Error:', error);
          showNotification({
            message: error.message,
            color: 'red',
          });
        }
      });
    } else {
      createJobApplicant(formData, {
        onSuccess: (response) => {
          showNotification({
            message: response.message,
            color: 'green'
          });
          onClose?.();
          refetch?.();
        },
        onError: (error) => {
          showNotification({
            message: error.message,
            color: 'red',
          });
        }
      });
    }

  };

  const handleDateChange = (field: string, index: number, dateRange: [Date | null, Date | null]) => {
    if (dateRange.every(date => date)) {
      form.setFieldValue(`${field}.${index}.durationStart`, dateRange[0]);
      form.setFieldValue(`${field}.${index}.durationEnd`, dateRange[1]);
    }
  };

  const handleError = (errors: typeof form.errors) => {
    console.log({ errors });
  };

  console.log("form", form.values)

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Grid gutter="md" mt='md'>
        {/* Personal Details */}
        <Grid.Col span={6}>
          <TextInput
            label="First Name"
            placeholder="Enter first name"
            required
            {...form.getInputProps('firstName')}
            classNames={classes}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Last Name"
            placeholder="Enter last name"
            required
            {...form.getInputProps('lastName')}
            classNames={classes}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="Email" required placeholder="Enter email" {...form.getInputProps('contactInfo.email')} classNames={classes} />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="Password" required placeholder="Enter password" {...form.getInputProps('password')} classNames={classes} />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="Phone Number" required placeholder="Enter phone number" {...form.getInputProps('contactInfo.phoneNumber')} classNames={classes} />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="Address" required placeholder="Enter address" {...form.getInputProps('contactInfo.address')} classNames={classes} />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="City" required placeholder="Enter city" {...form.getInputProps('contactInfo.city')} classNames={classes} />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="State" required placeholder="Enter state" {...form.getInputProps('contactInfo.state')} classNames={classes} />
        </Grid.Col>
        <Grid.Col span={4}>
          <TagsInput
            label="Skills"
            placeholder="Enter skills and press Enter"
            {...form.getInputProps('skills')}
            classNames={classes}
            styles={{
              inputField: {
                height: '2.2em'
              },
              pillsList: {
                textOverflow: 'ellipsis',
                overflow: "hidden",
                height: '2em'
              }
            }}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TagsInput
            label="Hobbies"
            placeholder="Enter hobbies and press Enter"
            {...form.getInputProps('hobbies')}
            classNames={classes}
            styles={{
              inputField: {
                height: '2.2em'
              },
              pillsList: {
                textOverflow: 'ellipsis',
                overflow: "hidden",
                height: '2em'
              }
            }}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TagsInput
            label="Strengths"
            placeholder="Enter strengths and press Enter"
            {...form.getInputProps('strengths')}
            classNames={classes}
            styles={{
              inputField: {
                height: '2.2em'
              },
              pillsList: {
                textOverflow: 'ellipsis',
                overflow: "hidden",
                height: '2em'
              }
            }}
          />
        </Grid.Col>
        <Grid.Col span={12}> <Text>Social Links</Text></Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Social Media Name"
            placeholder="Enter social media name"
            value={form.values.socialLinks.name}
            onChange={(event) => {
              form.setFieldValue('socialLinks.name', event.currentTarget.value);
            }}
            classNames={classes}
          />
        </Grid.Col>
        <Grid.Col span={8}>
          <TextInput
            label="Link"
            placeholder="Enter link"
            value={form.values.socialLinks.link}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              form.setFieldValue('socialLinks.link', event.currentTarget.value);
            }}
            classNames={classes}
          />
        </Grid.Col>

        {/* Project Section */}

        <Grid.Col span={12}> <Text>Projects</Text></Grid.Col>
        {form.values.projects.map((project, index) => (
          <Grid.Col span={12} key={index}>
            <Grid align="flex-end" gutter="md">
              <Grid.Col span={3}>
                <TextInput
                  label="Project Title"
                  placeholder="Enter project title"
                  {...form.getInputProps(`projects.${index}.title`)}
                  classNames={classes}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Group grow>
                  <DatePickerInput
                    type="range"
                    label="Duration"
                    placeholder="Select start and end date"
                    value={[form.values.projects[index].durationStart, form.values.projects[index].durationEnd]}
                    onChange={(dateRange) => handleDateChange('projects', index, dateRange)}
                    numberOfColumns={2}
                    weekendDays={[]}
                    classNames={classes}
                  />
                </Group>
              </Grid.Col>
              <Grid.Col span={3}>
                <TagsInput
                  classNames={classes}
                  label="Technologies Used"
                  placeholder="Enter technologies and press Enter"
                  {...form.getInputProps(`projects.${index}.technologiesUsed`)}
                  styles={{
                    inputField: {
                      height: '2.2em'
                    },
                    pillsList: {
                      textOverflow: 'ellipsis',
                      overflow: "hidden",
                      height: '2em'
                    }
                  }}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <TextInput
                  classNames={classes}
                  label="Description"
                  placeholder="Enter description"
                  {...form.getInputProps(`projects.${index}.description`)}
                />
              </Grid.Col>
              <Grid.Col span={1} >
                <Flex gap='md' align='center'>
                  <ActionIcon variant="light" w={30} color="blue" onClick={() => handleAddProject(index)} aria-label="Edit" disabled={!isProjectComplete(project) || index !== form.values.projects.length - 1 || project.durationStart === null || project.durationEnd === null}>
                    <IconPlus size={18} />
                  </ActionIcon>
                  {form.values.projects.length > 1 && (
                    <ActionIcon w={30} variant="light" color="red" onClick={() => handleDeleteProject(index)}>
                      <IconTrash size={18} />
                    </ActionIcon>
                  )}
                </Flex>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        ))}

        {/* Education Section */}
        <Grid.Col span={12}> <Text>Education</Text></Grid.Col>
        {form.values.education.map((education, index) => (
          <Grid.Col span={12} key={index}>
            <Grid align="flex-end" gutter="md">
              <Grid.Col span={3}>
                <TextInput
                  label="Degree"
                  placeholder="Enter degree"
                  {...form.getInputProps(`education.${index}.degree`)}
                  classNames={classes}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Institution"
                  placeholder="Enter institution"
                  required
                  {...form.getInputProps(`education.${index}.institution`)}
                  classNames={classes}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Year of Graduation"
                  placeholder="Enter year of graduation"
                  {...form.getInputProps(`education.${index}.yearOfGraduation`)}
                  classNames={classes}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <TextInput
                  classNames={classes}
                  label="Description"
                  placeholder="Enter description"
                  {...form.getInputProps(`education.${index}.description`)}
                />
              </Grid.Col>
              <Grid.Col span={1} >
                <Flex gap='md' align='center'>
                  <ActionIcon w={30} variant="light" color="blue" disabled={!isEducationComplete(education) || index !== form.values.education.length - 1} onClick={() => handleAddEducation(index)}>
                    <IconPlus size={18} />
                  </ActionIcon>
                  {form.values.education.length > 1 && (
                    <ActionIcon w={30} variant="light" color="red" onClick={() => handleDeleteEducation(index)}>
                      <IconTrash size={18} />
                    </ActionIcon>
                  )}
                </Flex>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        ))}

        {/* Experience Section */}
        <Grid.Col span={12}> <Text>Experience</Text></Grid.Col>
        {form.values.experienceDetails.map((experience, index) => (
          <Grid.Col span={12} key={index}>
            <Grid align="flex-end" gutter="md">
              <Grid.Col span={3}>
                <TextInput
                  label="Role"
                  placeholder="Enter role"
                  required
                  {...form.getInputProps(`experienceDetails.${index}.role`)}
                  classNames={classes}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Organization"
                  placeholder="Enter organization"
                  required
                  {...form.getInputProps(`experienceDetails.${index}.organization`)}
                  classNames={classes}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <DatePickerInput
                  type="range"
                  label="Duration"
                  placeholder="Select start and end date"
                  value={experience ? [experience.durationStart, experience.durationEnd] : [null, null]} // Ensure valid access
                  onChange={(dateRange) => handleDateChange('experienceDetails', index, dateRange)}
                  numberOfColumns={2}
                  weekendDays={[]}
                  classNames={classes}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <TextInput
                  classNames={classes}
                  label="Responsibilities"
                  placeholder="Enter responsibilities and press Enter"
                  {...form.getInputProps(`experienceDetails.${index}.responsibilities`)}
                />
              </Grid.Col>
              <Grid.Col span={1} >
                <Flex gap='md' align='center'>
                  <ActionIcon w={30} variant="light" color="blue" onClick={() => handleAddExperience(index)} disabled={!isExperienceComplete(experience) || index !== form.values.experienceDetails.length - 1}>
                    <IconPlus size={18} />
                  </ActionIcon>
                  {form.values.experienceDetails.length > 1 && (
                    <ActionIcon w={30} variant="light" onClick={() => handleDeleteExperience(index)}
                      color="red">
                      <IconTrash size={18} />
                    </ActionIcon>
                  )}
                </Flex>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        ))}

      </Grid>
      <Button mt="md" type="submit" px='xl' mx='auto'>
        Submit
      </Button>
    </form>
  );
}
import { TextInput, Button, Grid, Group, TagsInput, Flex, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from './ApplicantDetailsForm.module.css'
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { IEducation, IExperienceDetail, IProject } from '@agent-xenon/interfaces';
import dayjs from 'dayjs';
import { useCreateJobApplicant, useGetApplicantById } from '@agent-xenon/react-query-hooks';
import { useParams } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { useEffect } from 'react';
import { useUpdateJobApplicant } from '@/libs/react-query-hooks/src/lib/applicant/useUpdateJobApplicant';

export function ApplicantDetailsForm({ refetch, onClose, applicantId }: { refetch: () => void, onClose: () => void, applicantId: string }) {
  const { jobId } = useParams<{ jobId: string }>();
  const { mutate: createJobApplicant } = useCreateJobApplicant();
  const { mutate: updateJobApplicant } = useUpdateJobApplicant();
  const { data: applicantData } = useGetApplicantById({ applicantId: applicantId });

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      contactInfo: {
        address: '',
        city: '',
        state: '',
        email: '',
        password: '',
        phoneNumber: '',
      },
      skills: [] as string[],
      hobbies: [] as string[],
      strengths: [] as string[],
      experienceDetails: [{ duration: '', responsibilities: [] as string[], role: '', organization: '' }],
      education: [{ degree: '', institution: '', yearOfGraduation: '', description: '' }],
      projects: [{ title: '', duration: '', technologiesUsed: [] as string[], description: '' }],
      socialLinks: { name: '', link: '' }
    },
    validate: {
      firstName: (value: string) => (value.length === 0 ? 'First name is required' : null),
      lastName: (value: string) => (value.length === 0 ? 'Last name is required' : null),
      contactInfo: {
        email: (value: string) =>
          value.length === 0 ? 'Email is required' : /^\S+@\S+$/.test(value) ? null : 'Invalid email address',
        password: (value: string) =>
          value.length < 8 ? 'Password must be at least 8 characters' : null,
        phoneNumber: (value: string) => (value.length === 0 ? 'Phone number is required' : null),
        address: (value: string) => (value.length === 0 ? 'Address is required' : null),
        city: (value: string) => (value.length === 0 ? 'City is required' : null),
        state: (value: string) => (value.length === 0 ? 'State is required' : null),
      },
    },
  });

  useEffect(() => {
    console.log('applicantData', applicantData?.data);

    if (applicantData) {
      const socialLinksObj = applicantData?.data?.socialLinks as Record<string, string> || {};
      const socialLinkName = socialLinksObj ? Object.keys(socialLinksObj)[0] : '';
      const socialLinkValue = socialLinksObj ? socialLinksObj[socialLinkName] : '';

      form.setValues({
        firstName: applicantData?.data?.firstName || '',
        lastName: applicantData?.data?.lastName || '',
        contactInfo: {
          address: applicantData?.data?.contactInfo?.address || '',
          city: applicantData?.data?.contactInfo?.city || '',
          state: applicantData?.data?.contactInfo?.state || '',
          email: applicantData?.data?.contactInfo?.email || '',
          password: applicantData?.data?.contactInfo?.password || '',
          phoneNumber: applicantData?.data?.contactInfo?.phoneNumber || '',
        },
        skills: (applicantData?.data?.skills || []) as string[],
        hobbies: (applicantData?.data?.hobbies || []) as string[],
        strengths: (applicantData?.data?.strengths || []) as string[],
        experienceDetails: applicantData?.data?.experienceDetails || [{ duration: '', responsibilities: [] as string[], role: '', organization: '' }],
        education: applicantData?.data?.education || [{ degree: '', institution: '', yearOfGraduation: '', description: '' }],
        projects: applicantData?.data?.projects || [{ title: '', duration: '', technologiesUsed: [] as string[], description: '' }],
        socialLinks: applicantData?.data?.socialLinks
          ? { name: socialLinkName, link: socialLinkValue }
          : { name: '', link: '' },


      });
    }
  }, [applicantData]);

  const handleAddProject = (index: number) => {
    const newProject = {
      title: form.values.projects[index].title,
      duration: form.values.projects[index].duration,
      technologiesUsed: form.values.projects[index].technologiesUsed,
      description: form.values.projects[index].description,
    };

    if (!newProject.title || !newProject.duration || !newProject.description) {
      console.log("Please fill in all project fields.");
      return;
    }

    const updatedProjects = [...form.values.projects];
    updatedProjects.splice(index + 1, 0, { title: '', duration: '', technologiesUsed: [], description: '' });
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

    if (!newExperience.duration || !newExperience.role || !newExperience.organization) {
      console.log("Please fill in all experience fields.");
      return;
    }

    const updatedExperience = [...form.values.experienceDetails];
    updatedExperience.splice(index + 1, 0, { duration: '', responsibilities: [], role: '', organization: '' });
    form.setFieldValue('experienceDetails', updatedExperience);
  };

  const handleDeleteExperience = (index: number) => {
    const updatedExperience = form.values.experienceDetails.filter((_, i) => i !== index);
    form.setFieldValue('experienceDetails', updatedExperience);
  };

  const isProjectComplete = (project: IProject) => {
    return (
      project.title &&
      project.duration[0] &&
      project.duration[1] &&
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
      experience.duration &&
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
      contactInfo: form.values.contactInfo,
      skills: form.values.skills,
      hobbies: form.values.hobbies,
      strengths: form.values.strengths,
      projects: form.values.projects,
      education: form.values.education,
      experienceDetails: form.values.experienceDetails,
      jobId: jobId,
      socialLinks
    };
    console.log('Submitting to API:', formData);
    if (applicantId) {
      updateJobApplicant({ _id: applicantId, ...formData }, {
        onSuccess: (response) => {
          console.log('Response:', response);
          showNotification({
            message: 'Applicant created successfully!',
            color: 'green'
          });
          onClose?.();
          refetch?.();
        },
        onError: (error) => {
          console.log('Error:', error);
          showNotification({
            message: error.message,
            color: 'red'
          });
        }
      });
    } else {
      createJobApplicant(formData, {
        onSuccess: (response) => {
          console.log('Response:', response);
          showNotification({
            message: 'Applicant created successfully!',
            color: 'green'
          });
          onClose?.();
          refetch?.();
        },
        onError: (error) => {
          console.log('Error:', error);
          showNotification({
            message: error.message,
            color: 'red'
          });
        }
      });
    }

  };

  function parseDateRange(dateRangeStr: string): [Date | null, Date | null] {
    if (!dateRangeStr) return [null, null];
    const dates = dateRangeStr.split('_');
    return [
      dates[0] ? new Date(dates[0]) : null,
      dates[1] ? new Date(dates[1]) : null
    ];
  }

  const handleDateChange = (field: string, index: number, dateRange: [Date | null, Date | null]) => {
    if (dateRange.every(date => date)) {
      const formattedRange = `${dayjs(dateRange[0]).format('YYYY-MM-DD')}_${dayjs(dateRange[1]).format('YYYY-MM-DD')}`;
      form.setFieldValue(`${field}.${index}.duration`, formattedRange);
    }
  };

  const handleError = (errors: typeof form.errors) => {
    console.log({ errors });
  };

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
          <TextInput label="Password" required placeholder="Enter password" {...form.getInputProps('contactInfo.password')} classNames={classes} />
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
                    value={parseDateRange(form.values.projects[index].duration)}
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
                  <Button
                    onClick={() => handleAddProject(index)}
                    type="button"
                    disabled={!isProjectComplete(project) || index !== form.values.projects.length - 1}
                  >
                    <IconPlus size={22} />
                  </Button>
                  {form.values.projects.length > 1 && (
                    <Button
                      onClick={() => handleDeleteProject(index)}
                      type="button"
                      color="red"
                    >
                      <IconTrash size={22} />
                    </Button>
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
                  <Button
                    onClick={() => handleAddEducation(index)}
                    type="button"
                    disabled={!isEducationComplete(education) || index !== form.values.education.length - 1}
                  >
                    <IconPlus size={22} />
                  </Button>
                  {form.values.education.length > 1 && (
                    <Button
                      onClick={() => handleDeleteEducation(index)}
                      type="button"
                      color="red"
                    >
                      <IconTrash size={22} />
                    </Button>
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
                  value={parseDateRange(form.values.experienceDetails[index].duration)}
                  onChange={(dateRange) => handleDateChange('experienceDetails', index, dateRange)}
                  numberOfColumns={2}
                  weekendDays={[]}
                  classNames={classes}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <TagsInput
                  classNames={classes}
                  label="Responsibilities"
                  placeholder="Enter responsibilities and press Enter"
                  {...form.getInputProps(`experienceDetails.${index}.responsibilities`)}
                  styles={{
                    inputField: {
                      height: '2.2em'
                    },
                  }}
                />
              </Grid.Col>
              <Grid.Col span={1} >
                <Flex gap='md' align='center'>
                  <Button
                    onClick={() => handleAddExperience(index)}
                    type="button"
                    disabled={!isExperienceComplete(experience) || index !== form.values.experienceDetails.length - 1}
                  >
                    <IconPlus size={22} />
                  </Button>
                  {form.values.experienceDetails.length > 1 && (
                    <Button
                      onClick={() => handleDeleteExperience(index)}
                      type="button"
                      color="red"
                    >
                      <IconTrash size={22} />
                    </Button>
                  )}
                </Flex>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        ))}

      </Grid>
      <Button mt="md" type="submit">
        Submit
      </Button>
    </form>
  );
}
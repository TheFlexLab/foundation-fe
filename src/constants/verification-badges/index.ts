import React from 'react';
const HobbiesPopup = React.lazy(() => import('../../components/dialogue-boxes/HobbiesPopup'));
const VolunteerPopup= React.lazy(() => import('../../components/dialogue-boxes/VolunteerPopup'));
const CertificationsPopup= React.lazy(() => import('../../components/dialogue-boxes/CertificationsPopup'));
const PersonalBadgesPopup = React.lazy(() => import('../../components/dialogue-boxes/PersonalBadgesPopup'));
const EducationBadgePopup = React.lazy(() => import('../../components/dialogue-boxes/EducationBadgePopup'));
const IdentityBadgePopup = React.lazy(() => import('../../components/dialogue-boxes/IdentityBadgePopup'));
const WorkBadgePopup = React.lazy(() => import('../../components/dialogue-boxes/WorkBadgePopup'));

export const personalBadgeData = {
  firstName: {
    title: 'First Name',
    type: 'firstName',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/firstname.png`,
    placeholder: 'First Name Here',
    component: PersonalBadgesPopup,
  },
  lastName: {
    title: 'Last Name',
    type: 'lastName',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/lastname.png`,
    placeholder: 'Last Name Here',
    component: PersonalBadgesPopup,
  },
  dateOfBirth: {
    title: 'Date of Birth',
    type: 'dateOfBirth',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/dob.svg`,
    placeholder: 'MM/DD/YYYY',
    component: PersonalBadgesPopup,
  },
  currentCity: {
    title: 'Current City',
    type: 'currentCity',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/currentcity-1.png`,
    placeholder: 'Current City here',
    component: PersonalBadgesPopup,
  },
  homeTown: {
    title: 'Home Town',
    type: 'homeTown',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/hometown.svg`,
    placeholder: 'Hometown Here',
    component: PersonalBadgesPopup,
  },
  sex: {
    title: 'Sex',
    type: 'sex',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/relationaship-1.png`,
    placeholder: 'Choose',
    component: PersonalBadgesPopup,
  },
  relationshipStatus: {
    title: 'Relationship Status',
    type: 'relationshipStatus',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/relationship.svg`,
    placeholder: 'Choose',
    component: PersonalBadgesPopup,
  },
  work: {
    title: 'Work',
    type: 'work',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/work-a.png`,
    placeholder: 'Choose',
    component: WorkBadgePopup,
  },
  education: {
    title: 'Education',
    type: 'education',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/education-1.png`,
    placeholder: 'Choose',
    component: EducationBadgePopup,
  },
  hobbies: {
    title: 'Hobbies',
    type: 'hobbies',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/hobbies.svg`,
    placeholder: 'Choose',
    component: HobbiesPopup,
  },
  volunteer: {
    title: 'Volunteer',
    type: 'volunteer',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/volunteer.svg`,
    placeholder: 'Choose',
    component: VolunteerPopup,
  },
  certifications: {
    title: 'Certifications',
    type: 'certifications',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/certificate.svg`,
    placeholder: 'Choose',
    component: CertificationsPopup,
  },
  'id-passport': {
    title: 'ID / Passport',
    type: 'id-passport',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Identity-2x-1.png`,
    placeholder: 'ID / Passport Here',
    component: PersonalBadgesPopup,
  },
  geolocation: {
    title: 'Geolocation',
    type: 'geolocation',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/education-1.png`,
    placeholder: 'Geolocation',
    component: PersonalBadgesPopup,
  },
  'security-question': {
    title: 'Security Question',
    type: 'security-question',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/securityquestion-a.png`,
    placeholder: 'Answer Here',
    component: PersonalBadgesPopup,
  },
  identity: {
    title: 'Identity',
    type: 'identity',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/identity.svg`,
    placeholder: 'Identity Here',
    component: IdentityBadgePopup,
  },
};

export const relationshipData = [
  { id: 1, name: 'Single' },
  { id: 2, name: 'In a relationship' },
  { id: 3, name: 'Engaged' },
  { id: 4, name: 'Married' },
  { id: 5, name: "It's complicated" },
  { id: 6, name: 'In an open relationship' },
  { id: 7, name: 'Widowed' },
  { id: 8, name: 'Separated' },
  { id: 9, name: 'Divorced' },
];

export const sexOptions = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' },
  { id: 3, name: 'X' },
];

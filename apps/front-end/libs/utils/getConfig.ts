'use client';

export const getOrganizationName = (): string => {
  if (typeof window !== 'undefined') {
    const domain = window.location.hostname.split('.')[0];
    if (domain === 'localhost') {
      return 'transcodezy'
    } else return domain;
  }
  return '';
};

export const statusChecking = () => ({
  name: 'Checking',
  color: 'text-[#0FB063]',
  tooltipName: 'Verifying your answer. Please wait...',
  tooltipStyle: 'tooltip-success',
});

export const statusVerified = () => ({
  name: 'Ok',
  color: 'text-[#0FB063]',
  tooltipName: 'Answer is Verified',
  tooltipStyle: 'tooltip-success',
});

export const statusDuplicate = () => ({
  name: 'Duplicate',
  color: 'text-[#EFD700]',
  tooltipName: 'Found Duplication!',
  tooltipStyle: 'tooltip-error',
  duplication: true,
  showToolTipMsg: true,
});

export const statusRejected = () => ({
  name: 'Rejected',
  color: 'text-[#b00f0f]',
  tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
  tooltipStyle: 'tooltip-error',
  showToolTipMsg: true,
});

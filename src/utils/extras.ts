export const tooltipDefaultStatus = {
  name: 'Ok',
  color: 'text-[#389CE3] dark:text-blue-700',
  tooltipName: 'Please write something...',
  tooltipStyle: 'tooltip-info',
};

export function findFeedbackByUuid(data: any, givenUuid: string) {
  const result = data?.find((item: any) => item.uuids?.includes(givenUuid));

  return result ? result.id : null;
}

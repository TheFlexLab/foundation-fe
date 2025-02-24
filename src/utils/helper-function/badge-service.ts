export const getPersonalBadge = (persistedUserInfo: any, itemType: string) =>
  persistedUserInfo?.badges?.find((badge: any) => badge?.personal?.hasOwnProperty(itemType)) || null;

export const getWorkOrEduBadge = (persistedUserInfo: any, itemType: string) =>
  persistedUserInfo?.badges?.find((badge: any) => badge.personal && badge.personal.hasOwnProperty(itemType)) || null;

export const getContactBadge = (persistedUserInfo: any, itemType: string) =>
  persistedUserInfo?.badges?.find((badge: any) => badge.type === itemType) || null;

export const getWeb3Badge = (persistedUserInfo: any, itemType: string) =>
  persistedUserInfo?.badges?.find((badge: any) => badge?.web3?.hasOwnProperty(itemType)) || null;

export const checkPersonalBadge = (persistedUserInfo: any, itemType: string) =>
  persistedUserInfo?.badges?.some((badge: any) => badge?.personal?.hasOwnProperty(itemType) || false) || false;

export const checkWorkOrEdu = (persistedUserInfo: any, itemType: string) =>
  persistedUserInfo?.badges?.find((badge: any) => badge.personal && badge.personal.hasOwnProperty(itemType));

export const checkContact = (persistedUserInfo: any, itemType: string) =>
  persistedUserInfo?.badges?.some((badge: any) => badge.type === itemType);

export const checkWeb3Badge = (persistedUserInfo: any, itemType: string) =>
  persistedUserInfo?.badges?.some((badge: any) => badge?.web3?.hasOwnProperty(itemType) || false) || false;

export const getBadgeIdByType = (persistedUserInfo: any, itemType: string) =>
  persistedUserInfo?.badges?.find((badge: any) => badge?.type === itemType)?._id || null;

export const checkBadgeExists = (persistedUserInfo: any, itemType: string) =>
  persistedUserInfo?.badges?.some((badge: any) => badge?.type === itemType) || false;

export const getBadgeByType = (persistedUserInfo: any, itemType: string) =>
  persistedUserInfo?.badges?.find((badge: any) => badge?.type === itemType) || null;

function isWithin30Days(deletedAt) {
  const deletedDate = new Date(deletedAt);
  const currentDate = new Date();
  const diffInTime = currentDate - deletedDate;
  const diffInDays = diffInTime / (1000 * 60 * 60 * 24); // Convert time difference to days

  if (diffInDays <= 30) {
    const remainingTime = 30 - diffInDays;
    return Math.ceil(remainingTime); // Return time remaining in days, rounded up
  } else {
    return true; // Return true if more than 30 days have passed
  }
}

export const CanAdd = (userData, badgeName, type) => {
  const badgeRemoved = userData.badgeRemoved?.find((item) => item.badgeName === badgeName && item.type === type);

  if (badgeRemoved) {
    return isWithin30Days(badgeRemoved.deletedAt);
  } else {
    return true; // If no matching badge name is found, allow adding
  }
};

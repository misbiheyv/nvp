/**
 * Get the boundaries (start and end dates and times) of the nearest previous or current Thursday.
 *
 * @param [date=new Date()]
 * @param [offsetHours=0]
 */
export function getClosestThursdayBoundaries(date = new Date(), offsetHours = 0) {
  const utcOffset = offsetHours * 60;

  date.setMinutes(date.getMinutes() - utcOffset);

  const thursday = new Date(date);

  // Today is not Thursday
  if (date.getDay() !== 4) {
    const daysToThursday = (thursday.getDay() - 4 + 7) % 7;
    thursday.setDate(thursday.getDate() - daysToThursday);
  }

  const startBoundary = new Date(thursday);
  startBoundary.setHours(0, 0, 0, 0);

  const endBoundary = new Date(thursday);
  endBoundary.setHours(23, 59, 59, 999);

  startBoundary.setMinutes(startBoundary.getMinutes() + utcOffset);
  endBoundary.setMinutes(endBoundary.getMinutes() + utcOffset);

  return { startBoundary, endBoundary };
}

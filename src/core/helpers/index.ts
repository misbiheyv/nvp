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

  if (date.getDay() !== 4) {
    const daysToThursday = (thursday.getDay() - 4 + 7) % 7;
    thursday.setDate(thursday.getDate() - daysToThursday);
  }

  const
    startBoundary = new Date(thursday),
    endBoundary = new Date(thursday);

  startBoundary.setHours(0, 0, 0, 0);
  startBoundary.setMinutes(startBoundary.getMinutes() + utcOffset);

  endBoundary.setHours(23, 59, 59, 999);
  endBoundary.setMinutes(endBoundary.getMinutes() + utcOffset);

  return { startBoundary, endBoundary };
}

export const baseCommands = new Map([
  ['news', 'посмотреть все новинки'],
  ['ru_albums', 'посмотреть только русские альбомы'],
  ['en_albums', 'посмотреть только зарубежные альбомы'],
  ['ru_singles', 'посмотреть только русские синглы'],
  ['en_singles', 'посмотреть только зарубежные синглы']
]);

export const commands = new Map([
  ...baseCommands,
  ['help', 'узнать список команд'],
  ['start', 'запустить бота'],
  ['ping', 'проверить соединение']
]);

export const stringifiedCommands = [...commands.entries()].reduce((acc, [command, desc]) => `${acc}/${command} - ${desc}\n`, '');

export const stringifiedBaseCommands = [...baseCommands.entries()].reduce((acc, [command, desc]) => `${acc}/${command} - ${desc}\n`, '');

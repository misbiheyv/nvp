/**
 * Get the boundaries (start and end dates and times) of the nearest previous or current Thursday.
 *
 * @param [date]
 * @param [offsetHours]
 */
export function getClosestThursdayBoundaries(date = new Date(), offsetUTC = -3) {
  const utcOffsetMinutes = new Date().getTimezoneOffset() + offsetUTC * 60;

  date.setMinutes(date.getMinutes() - utcOffsetMinutes);

  const thursday = new Date(date);

  if (date.getUTCDay() !== 4) {
    const daysToThursday = (thursday.getUTCDay() - 4 + 7) % 7;
    thursday.setUTCDate(thursday.getUTCDate() - daysToThursday);
  }

  const
    startBoundary = new Date(thursday),
    endBoundary = new Date(thursday);

  startBoundary.setUTCHours(offsetUTC, 0, 0, 0);
  endBoundary.setUTCHours(23 + offsetUTC, 59, 59, 999);

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

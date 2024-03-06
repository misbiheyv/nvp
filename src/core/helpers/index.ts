/**
 * Возвращает время начала и конца текущего или прошлого четверга.
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

/**
 * Список всех доступных команд
 */
export const commands = new Map([
  ['news', {desc: 'посмотреть все новинки', type: 'base'}],
  ['ru_albums', {desc: 'посмотреть только русские альбомы', type: 'base'}],
  ['en_albums', {desc: 'посмотреть только зарубежные альбомы', type: 'base'}],
  ['ru_singles', {desc: 'посмотреть только русские синглы', type: 'base'}],
  ['en_singles', {desc: 'посмотреть только зарубежные синглы', type: 'base'}],

  ['help', {desc: 'узнать список команд', type: 'system'}],
  ['start', {desc: 'запустить бота', type: 'system'}],

  ['ping', {desc: 'проверить соединение', type: 'debug'}]
]);

/**
 * Список всех доступных команд в формате строки
 */
export const stringifiedCommands = [...commands.entries()].reduce(
  (acc, [command, info]) => info.type !== 'debug' ? `${acc}/${command} - ${info.desc}\n` : acc,
  ''
);

/**
 * Список всех основных команд в формате строки
 */
export const stringifiedBaseCommands = [...commands.entries()].reduce(
  (acc, [command, info]) => info.type === 'base' ? `${acc}/${command} - ${info.desc}\n` : acc,
  ''
);

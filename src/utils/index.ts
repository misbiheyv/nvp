import 'dotenv/config';

// eslint-disable-next-line max-len
export const WARNING_MSG = 'PS. Это не бот группы "Новинки в пятницу", я просто беру информацию из их постов. Поддержите ребят и подпишитесь на канал "Новинки в пятницу" в ТГ или группу ВК';

export const ENV = process.env.NODE_ENV || 'development';
export const IS_PROD = ENV === 'production';

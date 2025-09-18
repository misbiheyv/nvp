import {Command} from './types';
import {lastNews} from './last-news';
import {notifyOn} from './notify-on';
import {notifyOff} from './notify-off';
import {notifyHour} from './notify-hour';

export type * from './types';

export const commands: Command[] = [lastNews, notifyHour, notifyOn, notifyOff];

export {lastNews, notifyHour, notifyOn, notifyOff};

import {Command} from './types';
import {lastNews} from './last-news';
import {notifyOn} from './notify-on';
import {notifyOff} from './notify-off';
import {notifyHour} from './notify-hour';
import {getDebugInfo} from './get-debug-info';

export type * from './types';

export const commands: Command[] = [lastNews, notifyHour, notifyOn, notifyOff, getDebugInfo];

export {lastNews, notifyHour, notifyOn, notifyOff, getDebugInfo};

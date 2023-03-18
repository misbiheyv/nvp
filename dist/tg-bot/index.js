"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const telegraf_1 = require("telegraf");
const bot = new telegraf_1.Telegraf('5909365320:AAEVTZZBhIcYNuevrBpExKS5S7YXJ0eeM2k');
exports.bot = bot;
bot.start((ctx) => ctx.reply('Welcome'));
function run() {
    try {
        bot.launch();
    }
    catch (err) {
        console.log(err);
    }
}
exports.default = run;

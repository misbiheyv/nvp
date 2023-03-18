import { Telegraf } from 'telegraf';

const bot = new Telegraf('5909365320:AAEVTZZBhIcYNuevrBpExKS5S7YXJ0eeM2k');

bot.start((ctx) => ctx.reply('Welcome'));

export { bot };

export default function run() {
    try {
        bot.launch();
    } catch(err) {
        console.log(err)
    }
}
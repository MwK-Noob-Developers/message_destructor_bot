const Telegraf = require('telegraf');
const Extra = require('telegraf/extra')


const bot = new Telegraf('1975641845:AAFpxbc0H3rZ4qBavog0Mn7GYvALwnXWiA4'); //Write @BotFather /newbot and follow instructions

const chats = {};
const inlineMessageRatingKeyboard = [[
    { text: '👍', url: 't.me/mwklinks' },
    { text: '👎', url: 't.me/redbullFED' }
]];

bot.help(function (ctx) {
    ctx.reply("Hello! I'm Destructor. I can destruct messages after a specified time\n" +
        "Send: `/set <seconds>` to set time (0 - do not delete)", { reply_markup: JSON.stringify({ inline_keyboard: inlineMessageRatingKeyboard }) }, Extra.markdown());
});

bot.command("set", function (ctx) {
    var time = parseInt(ctx.message.text.split(' ')[1], 10);
    if(!isNaN(time)) {
        if(!(ctx.message.chat.id in chats)) {
            chats[ctx.message.chat.id] = {};
        }
        chats[ctx.message.chat.id].timer = time * 1000;
        ctx.reply("Message destruct timer is set to " + time + " sec");
    }
    else {
        ctx.reply("Error.\nSend: `/set <seconds>` to set time\n" +
            "Eg: `/set 5` will set timer to 5 sec", Extra.markdown());
    }
});

function onMessage(ctx) {
    if(ctx.message.chat.id in chats && chats[ctx.message.chat.id].timer > 0) {
        setTimeout(function () {
            ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
        }, chats[ctx.message.chat.id].timer);
    }
}

bot.on("message", onMessage);

bot.launch();

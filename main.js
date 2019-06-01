const Telegraf = require('telegraf');
const Extra = require('telegraf/extra')


const bot = new Telegraf('BOT_TOKEN'); //Write @BotFather /newbot and follow instructions

const chats = {};

bot.help(function (ctx) {
    ctx.reply("Hello! I'm Destructor. I can destruct messages after a specified time\n" +
        "Send: `/timer <seconds>` to set time (0 - do not delete)", Extra.markdown());
});

bot.command("timer", function (ctx) {
    var time = parseInt(ctx.message.text.split(' ')[1], 10);
    if(!isNaN(time)) {
        if(!(ctx.message.chat.id in chats)) {
            chats[ctx.message.chat.id] = {};
        }
        chats[ctx.message.chat.id].timer = time * 1000;
        ctx.reply("Message destruct timer is set to " + time + " sec");
    }
    else {
        ctx.reply("Error.\nSend: `/timer <seconds>` to set time\n" +
            "Eg: `/timeout 5` will set timer to 5 sec", Extra.markdown());
    }
});

function onMessage(ctx) {
    console.log(ctx.message.message_id);
    if(ctx.message.chat.id in chats && chats[ctx.message.chat.id].timer > 0) {
        setTimeout(function () {
            ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
        }, chats[ctx.message.chat.id].timer);
    }
}
bot.use(onMessage);

bot.launch();

require("dotenv").config();
const Telegraf = require("telegraf");
const bin = require("./bin");

const username = process.env.BOT_UNAME;

const welcome = "<b>Hi There,\nCheck my Commands List : </b>/help\n<b>Have a Good Day</b>";
const about = "<b>Hi There, I am " + username + "\n" +
  "● I Can Fetch BIN details for you from Bins.Su\n" +
  "● My Source Code :  <a href='https://gitlab.com/ArnabXD/bins-su-tgbot'>Click Here</a>\n" +
  "● For API you can check <a href='https://github.com/ArnabXD/bins-su-api'>this</a>\n" +
  "● Bugs/Error/Suggestions : Contact this <a href='tg://user?id=611816596'>noob</a></b>";
const help = "<b>To Searh Bin Details Send : </b> /bin YOURBIN\n" +
  "<b>About Me : </b> /about\n" +
  "<b>Get This Help Option : </b> /help";

const bot = new Telegraf(process.env.BOT_TOKEN, { username: username });

bot.start((ctx) => ctx.replyWithHTML(welcome));
bot.help((ctx) => ctx.replyWithHTML(help));
bot.command("about", (ctx) => ctx.replyWithHTML(about))
bot.command("bin", (ctx) => {
  ctx.webhookReply = false;
  let args = ctx.message.text.substr(5);
  if (ctx.message.text.match(username)) {
    args = ctx.message.text.substr(5 + username.length);
  }
  bin.search(args)
    .then((res) => {
      ctx.replyWithHTML(res);
    });
});

bot.launch({
  webhook: {
    domain: process.env.BOT_DOMAIN,
    port : process.env.PORT // No need for heroku
    }
}); //==>> With WebHook

// bot.launch(); // Without WebHook
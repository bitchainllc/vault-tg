import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import getPoolData from "./services/connWeb3.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log("Response time: %sms", ms);
});
bot.command("vault", async (ctx) => {
  const message = await getPoolData();
  if (!!message) {
    ctx.reply(message, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔗 Join The Vault",
              url: "https://app.sakaivault.io/vault",
            },
          ],
        ],
      },
    });
  }
});

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err.message);
});
bot.start((ctx) => {
  throw new Error("Example error");
});

bot.on("text", (ctx) => ctx.reply("/vault to get vault info"));
bot.launch();

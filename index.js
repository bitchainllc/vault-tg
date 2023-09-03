import dotenv from "dotenv";
import { Telegraf, Input } from "telegraf";
import getPoolData from "./services/connWeb3.js";
import axios from "axios";

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

bot.command("ticket", async (ctx) => {
  if (ctx.update.message.from.is_bot) {
    return false;
  }

  const args = ctx.update.message.text.split(" ");

  const question = args[1];

  if (!!question) {
    ctx.sendChatAction("typing");
    console.log(question);
    await axios
      .get(`https://vault.sakaivault.io/api/metadata/56/${question}`)
      .then(async (res) => {
        const metadata = res.data;
        const { image } = metadata;
        return ctx.replyWithPhoto(Input.fromURL(image), {
          reply_to_message_id: ctx.message.message_id,
        });
      })
      .catch((err) => {
        return ctx.reply("NFT is not found.", {
          reply_to_message_id: ctx.message.message_id,
        });
      });
  }
});

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err.message);
});
bot.start((ctx) => {
  throw new Error("Example error");
});

bot.on("text", (ctx) => null);
bot.launch();

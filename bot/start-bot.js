import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN env var is required");

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://hexacoin.app";

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const referralCode = match?.[1] ?? null;

  // If user came via referral link, pass refCode in the web_app URL
  const launchUrl = referralCode ? `${appUrl}?ref=${referralCode}` : appUrl;

  await bot.sendMessage(
    chatId,
    "🎮 *Welcome to Hexa Coin!*\n\nOpen hex tiles, earn HXCO & TON rewards. Connect your TON wallet and start playing!",
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Open Hexa Coin",
              web_app: { url: launchUrl },
            },
          ],
        ],
      },
    }
  );
});

bot.on("polling_error", (err) => {
  console.error("[Bot polling error]", err.message);
});

console.log("Hexa Coin bot started");

import TelegramBot from "node-telegram-bot-api";


const bot = new TelegramBot("7921923955:AAGhbmn2FLr2RSALGtl_ZU3w2n_al15921I", { polling: true });

console.log("=======bot" , bot)

// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;

//   bot.sendMessage(chatId, "🚀 Tap the button below to open the Mini App:", {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: "Open Mini App",
//             web_app: {
//               url: "https://d274-2404-3100-1c79-21e-7464-eae3-3f52-c43b.ngrok-free.app/",
//             },
//           },
//         ],
//       ],
//     },
//   });
// });

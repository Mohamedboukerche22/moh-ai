
import TelegramBot from "node-telegram-bot-api";
import Bytez from "bytez.js";
import * as math from "mathjs";
import 'dotenv/config'


const token = process.env.TELEGRAM_BOT_TOKEN; 
const bot = new TelegramBot(token, { polling: true });


const key = process.env.BYTEZ_API_KEY; 
const sdk = new Bytez(key);
const model = sdk.model("openai/gpt-4o-mini");

let users = [];
let conversations = {}; 
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  if (!users.includes(chatId)) users.push(chatId);
  bot.sendMessage(chatId, "Welcome! You are now added to the bot list. I am Moh-GPT, created by Mohamed Boukerche!");
});

bot.onText(/\/hello/, (msg) => {
  bot.sendMessage(msg.chat.id, "Hello! 👋 I am Moh-GPT, created by Mohamed Boukerche! Ready to calculate or chat.");
});
bot.onText(/\/calc (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const expression = match[1];
  try {
    const result = math.evaluate(expression);
    bot.sendMessage(chatId, `Result: ${result}`);
  } catch {
    bot.sendMessage(chatId, `❌ Invalid calculation.`);
  }
});

bot.onText(/\/randomhi/, (msg) => {
  const chatId = msg.chat.id;
  if (users.length === 0) {
    bot.sendMessage(chatId, "No users to pick yet. Have them send /start first!");
    return;
  }
  const randomUserId = users[Math.floor(Math.random() * users.length)];
  bot.sendMessage(randomUserId, "Hi! What's up?");
  bot.sendMessage(chatId, "Sent a greeting to a random user!");
});
bot.onText(/\/ask (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const question = match[1].trim();
  const qLower = question.toLowerCase();
  if (
    qLower.includes("who are you") ||
    qLower.includes("your name") ||
    qLower.includes("creator") ||
    qLower.includes("who created you") ||
    qLower.includes("who made you")
  ) {
    bot.sendMessage(chatId, "I am Moh-GPT, created by Mohamed Boukerche! 👋");
    return;
  }
  if (!conversations[chatId]) {
    conversations[chatId] = [
      { role: "system", content: "You are Moh-GPT, created by Mohamed Boukerche." }
    ];
  }
  conversations[chatId].push({ role: "user", content: question });

  (async () => {
    try {
      const { error, output } = await model.run(conversations[chatId]);
      if (error) {
        bot.sendMessage(chatId, `❌ AI Error: ${error}`);
      } else {
        bot.sendMessage(chatId, output.content);
        conversations[chatId].push({ role: "assistant", content: output.content });
      }
    } catch (err) {
      bot.sendMessage(chatId, "❌ Failed to get AI response.");
      console.error(err);
    }
  })();
});
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase();
  if (!text) return;

  if (text.includes("mohamed boukerche")) {
    bot.sendMessage(chatId, "Hey! Mohamed Boukerche is my creator! 👋");
  }
});

//this is mohamed boukerche work
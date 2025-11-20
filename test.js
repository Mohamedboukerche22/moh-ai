import Bytez from "bytez.js";

const sdk = new Bytez("6472a527365d0310bd4a8c902632605d");
const model = sdk.model("openai/gpt-4o-mini");

(async () => {
  const { error, output } = await model.run([
    { role: "user", content: "Hello" }
  ]);
  console.log({ error, output });
})();

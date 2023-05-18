const { Configuration, OpenAIApi } = require("openai");
const { writeFileSync } = require("fs");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

(async () => {
  try {
    const message = process.argv[2];

    if (!message) {
      console.log("Invalid message!");
      return;
    }

    const prompt = `The following is a conversation with Dave and an interviewer.
Interviewer: Hello, who are you?
Dave: Hello, I am Dave. How can I help you today?
Interviewer: ${message}.
Dave: `;

    const { data } = await openai.createCompletion({
      model: "curie:ft-test-llc-2023-02-13-18-32-12",
      prompt,
      temperature: 0,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
    });

    const { text } = data.choices[0];

    writeFileSync("response.json", text);

    const [answer, next] = text.split("Interviewer: ");

    console.log("Answer:", answer);
    console.log(`You may ask next; ${next.slice(0, next.indexOf("Dave: "))}`);
  } catch (err) {
    console.error(err);
  }
})();

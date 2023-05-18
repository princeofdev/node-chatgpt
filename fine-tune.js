const { Configuration, OpenAIApi } = require("openai");
const { writeFileSync, createReadStream } = require("fs");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const [, , command, arg] = process.argv;

function writeResponse(data) {
  writeFileSync("response.json", JSON.stringify(data, undefined, 2));
}

async function createFineTune() {
  if (!arg) {
    console.log("File name is empty!");
    return;
  }

  const { data: file } = await openai.createFile(
    createReadStream(arg),
    "fine-tune"
  );

  const { data: fineTune } = await openai.createFineTune({
    training_file: file.id,
  });

  console.log(
    "Fine tune created successfully! Find details in response.json file."
  );

  writeResponse(fineTune);
}

async function retrieveFineTune() {
  if (!arg) {
    console.log("File name is empty!");
    return;
  }

  const { data } = await openai.retrieveFineTune(arg);

  console.log(
    "Fine tune retrieved successfully! Find details in response.json file."
  );

  writeResponse(data);
}

async function cancelFineTune() {
  if (!arg) {
    console.log("File name is empty!");
    return;
  }

  const { data } = await openai.cancelFineTune(arg);

  console.log(
    "Fine tune cancelled successfully! Find details in response.json file."
  );

  writeResponse(data);
}

async function listFineTunes() {
  const { data } = await openai.listFineTunes();

  console.log(
    "Fine tune listed successfully! Find details in response.json file."
  );

  writeResponse(data);
}

const requestFunc = {
  create: createFineTune,
  retrieve: retrieveFineTune,
  cancel: cancelFineTune,
  list: listFineTunes,
};

(async function () {
  const request = requestFunc[command || ""];

  if (!request) {
    console.log("Unknown command.");
    return;
  }

  try {
    await request();
  } catch (err) {
    console.error(err);
  }
})();

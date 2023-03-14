import fs from "fs";
import prompts from "prompts";

function getDefaultPath() {
  switch (process.platform) {
    case "darwin":
      return "/Volumes/Kindle/system/vocabulary/vocab.db";
    default:
      return "";
  }
}

async function getDBPath() {
  const { pathToDB } = await prompts({
    type: "text",
    name: "pathToDB",
    message: "Please enter the path to the 'vocab.db' file",
    initial: getDefaultPath(),
    validate(value) {
      if (!fs.existsSync(value)) {
        return `file '${value}' doesn't exist`;
      }
      return true;
    },
  });

  return pathToDB as string;
}

export { getDBPath };

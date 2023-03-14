import downloadsFolder from "downloads-folder";
import prompts from "prompts";

async function selectDecksPath() {
  const { decksPath } = await prompts({
    type: "text",
    name: "decksPath",
    message: `Please enter decks path`,
    initial: downloadsFolder(),
  });

  return decksPath as string;
}

export { selectDecksPath };

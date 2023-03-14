import prompts from "prompts";

async function selectDeckName(lang: string) {
  const { deckName } = await prompts({
    type: "text",
    name: "deckName",
    message: `Please enter deck name for '${lang}' language`,
    initial: lang,
  });

  return deckName as string;
}

export { selectDeckName };

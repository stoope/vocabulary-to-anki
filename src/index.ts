import fs from "fs";
import colors from "colors/safe";
import path from "path";
import { getDB } from "./steps/getDB";
import { getDBPath } from "./steps/getDBPath";
import { selectBooks } from "./steps/selectBooks";
import { selectLanguage } from "./steps/selectLanguage";
import { deleteBooks } from "./steps/deleteBooks";
import { selectDeckName } from "./steps/selectDeckName";
import { Lookup } from "kindle-vocab-tools";
import { generateDeck } from "./steps/generateDeck";
import { selectDecksPath } from "./steps/selectDecksPath";

const rootPath = __dirname;

async function run() {
  console.log(
    colors.yellow(
      `Please ensure you have Google Cloud ${colors.bold(
        "Text-to-Speech"
      )} and ${colors.bold("Translation")} API's enabled and ${colors.bold(
        "gcloud"
      )} CLI installed and configured:`
    )
  );
  console.log(
    colors.yellow(`https://www.npmjs.com/package/@google-cloud/text-to-speech`)
  );
  console.log(
    colors.yellow(`https://www.npmjs.com/package/@google-cloud/translate`)
  );
  console.log(colors.yellow(`https://cloud.google.com/sdk/gcloud`));

  const pathToDB = await getDBPath();

  const db = await getDB(pathToDB);

  const books = await selectBooks(await db.getAllBooks());

  if (!books) {
    console.log(
      colors.yellow("You don't have any book at the Vocabulary Builder")
    );
    return;
  }

  const deckNames = new Map();
  const lookups = new Map<string, Lookup[]>();

  for (const book of books) {
    const lang = await selectLanguage(`Select language of '${book.title}'`);
    book.lang = lang.value;
    deckNames.set(lang.value, lang.title);

    const bookLookups = await db.getLookupsByBookId(book.id);
    if (!lookups.has(lang.value)) {
      lookups.set(lang.value, []);
    }
    lookups.get(lang.value)?.push(...bookLookups);
  }

  for (const [key, lang] of deckNames.entries()) {
    const deckName = await selectDeckName(lang);
    deckNames.set(key, deckName);
  }

  const deleteBooksAfterExport = await deleteBooks();

  const outLang = await selectLanguage(`Select language for translation`);

  const decksPath = await selectDecksPath();

  for (const [key, name] of deckNames.entries()) {
    console.log(`Generating '${name}' deck...`);
    const deck = await generateDeck({
      deckName: name,
      inLang: key,
      lookups: lookups.get(key) ?? [],
      outLang: outLang.value,
      rootPath,
    });
    fs.writeFileSync(path.join(decksPath, `${name}.apkg`), deck, "binary");
    console.log(colors.green("Done!"));
  }

  if (deleteBooksAfterExport) {
    console.log("Removing books from Kindle Vocabulary Builder...");
    for (const book of books) {
      await db.deleteBookWithLookups(book.id);
    }
    console.log(colors.green("Done!"));
  }
}

run();

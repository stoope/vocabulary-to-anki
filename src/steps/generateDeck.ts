import { Lookup } from "kindle-vocab-tools";
import fs from "fs";
import path from "path";
import ProgressBar from "progress";
import { v4 as uuidv4 } from "uuid";
import Mustache from "mustache";
import { getSpeech } from "./getSpeech";
import { getTranslate } from "./getTranslate";
import { getDeck } from "./getDeck";

interface GenerateDeck {
  deckName: string;
  lookups: Lookup[];
  inLang: string;
  outLang: string;
  rootPath: string;
}

async function generateDeck({
  deckName,
  lookups,
  inLang,
  outLang,
  rootPath,
}: GenerateDeck) {
  const progress = new ProgressBar(":bar :percent", {
    total: lookups.length,
  });

  const deck = getDeck(deckName, rootPath);

  for (const lookup of lookups) {
    const wordSpeech = await getSpeech(lookup.word, inLang);
    const wordSpeechName = `${uuidv4()}.mp3`;
    const usageSpeech = await getSpeech(lookup.usage, inLang);
    const usageSpeechName = `${uuidv4()}.mp3`;

    const usageTranslate = await getTranslate(lookup.usage, inLang, outLang);

    const formattedUsage = lookup.usage.replace(
      new RegExp("(" + lookup.word + ")", "gi"),
      "<strong><em>$1</em></strong>"
    );

    const front = Mustache.render(
      fs.readFileSync(path.join(rootPath, "assets/front.html")).toString(),
      {
        word: lookup.word,
        audioWordFilePath: wordSpeechName,
        usage: formattedUsage,
      }
    );

    const back = Mustache.render(
      fs.readFileSync(path.join(rootPath, "assets/back.html")).toString(),
      {
        stem: lookup.stem,
        book_title: lookup.book_title,
        usage: formattedUsage,
        audioUsageFilePath: usageSpeechName,
        translate: usageTranslate,
      }
    );

    deck.addMedia(wordSpeechName, wordSpeech);
    deck.addMedia(usageSpeechName, usageSpeech);

    deck.addCard(front, back);
    progress.tick();
  }

  return await deck.save();
}

export { generateDeck };

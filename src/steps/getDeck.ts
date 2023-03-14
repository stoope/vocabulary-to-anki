import fs from "fs";
import path from "path";
import AnkiExport from "anki-apkg-export";

export function getDeck(deckName: string, rootPath: string) {
  const styles = fs
    .readFileSync(path.join(rootPath, "assets/styles.css"))
    .toString();

  return new AnkiExport(deckName, {
    questionFormat: "{{Front}}",
    answerFormat: "{{Back}}",
    css: styles,
  });
}

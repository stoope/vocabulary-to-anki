import { v2 } from "@google-cloud/translate";

const translate = new v2.Translate();

async function getTranslate(
  stem: string,
  from: string,
  to: string
): Promise<string> {
  const [translation] = await translate.translate(stem, { from, to });

  return translation;
}

export { getTranslate };

import textToSpeech from "@google-cloud/text-to-speech";

const client = new textToSpeech.TextToSpeechClient();

async function getSpeech(stem: string, langCode: string) {
  const [response] = await client.synthesizeSpeech({
    input: { text: stem },
    voice: { languageCode: langCode },
    audioConfig: { audioEncoding: "MP3" },
  });

  return response.audioContent;
}

export { getSpeech };

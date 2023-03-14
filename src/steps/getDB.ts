import KindleVocabTools from "kindle-vocab-tools";

async function getDB(pathToDB: string) {
  const db = new KindleVocabTools({
    pathToDB,
  });

  await db.init();

  return db;
}

export { getDB };

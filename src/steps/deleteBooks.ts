import prompts from "prompts";

async function deleteBooks() {
  const { deleteBooks } = await prompts({
    type: "toggle",
    name: "deleteBooks",
    message: "Delete books from Vocabulary Builder after export?",
    initial: false,
    active: "yes",
    inactive: "no",
  });

  return deleteBooks as boolean;
}

export { deleteBooks };

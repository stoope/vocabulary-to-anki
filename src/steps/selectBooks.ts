import { Book } from "kindle-vocab-tools";
import prompts from "prompts";

async function selectBooks(books: Book[]) {
  const { books: result } = await prompts({
    type: "multiselect",
    name: "books",
    message: "Choose the books",
    choices: books.map((book) => ({ title: book.title, value: book })),
    hint: "- Space to select. Return to submit",
  });

  return result as Book[];
}

export { selectBooks };

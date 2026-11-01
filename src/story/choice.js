// Answer options are shown in a random but stable order per question, and are
// labelled by position, so the correct answer cannot be found from where it
// stands in the list.
const orders = new Map();
export function inRandomOrder(key, items) {
  if (!orders.has(key)) {
    const ids = items.map((item) => item.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    orders.set(key, ids);
  }
  return orders.get(key).map((id) => items.find((item) => item.id === id));
}
export const LETTERS = ["A", "B", "C", "D", "E"];

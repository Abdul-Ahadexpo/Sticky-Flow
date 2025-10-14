import { Note } from '../types';

export function parseDateString(dateStr: string): Date {
  const parts = dateStr.split('/');
  if (parts.length !== 3) {
    return new Date(0);
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  let year = parseInt(parts[2], 10);

  if (year < 100) {
    year += year < 50 ? 2000 : 1900;
  }

  return new Date(year, month, day);
}

export function sortNotesByDateAscending(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => {
    const dateA = parseDateString(a.date);
    const dateB = parseDateString(b.date);
    return dateA.getTime() - dateB.getTime();
  });
}

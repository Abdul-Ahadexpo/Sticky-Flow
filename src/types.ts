export interface Note {
  id: string;
  mainText: string;
  hiddenDescription?: string;
  date: string;
  markWithX: boolean;
  createdAt: number;
}

export interface HelpText {
  content: string;
}

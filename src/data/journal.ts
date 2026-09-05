export type JournalEntry = {
  id: string;
  title: string;
  excerpt?: string;
  category?: string;
  date?: string;
  tags?: string[];
  content: string;
  published: boolean;
  featured?: boolean;
  relatedProject?: {
    name: string;
    id?: string;
  };
};

/**
 * Verified Journal Entries repository.
 * Strictly adheres to data accuracy: only genuine, authored engineering notes
 * and reflections from Sayam are published here. All fabricated placeholder
 * articles, invented reading times, and simulated reflections have been purged.
 */
export const JOURNAL_ENTRIES: JournalEntry[] = [];

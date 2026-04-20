export interface Phrase {
  id: string;
  bangla: string;
  arabic: string;
  pronunciation: string;
  literalBangla?: string;
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  phrases: Phrase[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SaudiLearningData {
  categories: Category[];
}

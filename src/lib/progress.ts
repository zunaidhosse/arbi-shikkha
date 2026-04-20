import { useState, useEffect } from 'react';
import { saudiData } from '@/src/data/lessons';

const PROGRESS_KEY = 'arbi_learned_phrases';

export function getLearnedPhrases(): string[] {
  const saved = localStorage.getItem(PROGRESS_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveLearnedPhrases(ids: string[]) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event('progress_updated'));
}

export function useProgress() {
  const [learned, setLearned] = useState<string[]>(getLearnedPhrases());

  useEffect(() => {
    const handleUpdate = () => {
      setLearned(getLearnedPhrases());
    };
    window.addEventListener('progress_updated', handleUpdate);
    return () => window.removeEventListener('progress_updated', handleUpdate);
  }, []);

  const toggleLearned = (id: string) => {
    const newItems = learned.includes(id)
      ? learned.filter(i => i !== id)
      : [...learned, id];
    saveLearnedPhrases(newItems);
  };

  const getCategoryProgress = (categoryId: string) => {
    const category = saudiData.categories.find(c => c.id === categoryId);
    if (!category) return 0;
    const count = category.phrases.filter(p => learned.includes(p.id)).length;
    return Math.round((count / category.phrases.length) * 100);
  };

  const getTotalProgress = () => {
    const totalPhrases = saudiData.categories.reduce((acc, cat) => acc + cat.phrases.length, 0);
    const count = learned.length;
    return totalPhrases > 0 ? Math.round((count / totalPhrases) * 100) : 0;
  };

  return { learned, toggleLearned, getCategoryProgress, getTotalProgress };
}

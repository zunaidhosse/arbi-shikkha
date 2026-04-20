import { useState, useEffect } from 'react';
import { saudiData } from '@/src/data/lessons';

const PROGRESS_KEY = 'arbi_learned_phrases';
const STREAK_KEY = 'arbi_streak';
const LAST_ACTIVITY_KEY = 'arbi_last_activity';

export function getLearnedPhrases(): string[] {
  const saved = localStorage.getItem(PROGRESS_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveLearnedPhrases(ids: string[]) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event('progress_updated'));
}

export function getStreak(): number {
  const saved = localStorage.getItem(STREAK_KEY);
  return saved ? parseInt(saved) : 0;
}

export function updateActivity() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const lastActivityStr = localStorage.getItem(LAST_ACTIVITY_KEY);
  const currentStreak = getStreak();

  if (!lastActivityStr) {
    localStorage.setItem(STREAK_KEY, '1');
    localStorage.setItem(LAST_ACTIVITY_KEY, today);
  } else {
    const lastDate = new Date(lastActivityStr);
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    
    if (lastDate.toISOString() === yesterday.toISOString()) {
      localStorage.setItem(STREAK_KEY, (currentStreak + 1).toString());
      localStorage.setItem(LAST_ACTIVITY_KEY, today);
    } else if (lastDate.toISOString() !== today) {
      // If it's not today and not yesterday, reset streak
      if (new Date(today) > new Date(lastDate.getTime() + 86400000 * 1.5)) {
        localStorage.setItem(STREAK_KEY, '1');
      }
      localStorage.setItem(LAST_ACTIVITY_KEY, today);
    }
  }
  window.dispatchEvent(new Event('streak_updated'));
}

export function useProgress() {
  const [learned, setLearned] = useState<string[]>(getLearnedPhrases());
  const [streak, setStreak] = useState<number>(getStreak());

  useEffect(() => {
    const handleUpdate = () => {
      setLearned(getLearnedPhrases());
    };
    const handleStreakUpdate = () => {
      setStreak(getStreak());
    };
    window.addEventListener('progress_updated', handleUpdate);
    window.addEventListener('streak_updated', handleStreakUpdate);
    return () => {
      window.removeEventListener('progress_updated', handleUpdate);
      window.removeEventListener('streak_updated', handleStreakUpdate);
    };
  }, []);

  const toggleLearned = (id: string) => {
    const newItems = learned.includes(id)
      ? learned.filter(i => i !== id)
      : [...learned, id];
    saveLearnedPhrases(newItems);
    updateActivity();
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

  return { learned, streak, toggleLearned, getCategoryProgress, getTotalProgress };
}

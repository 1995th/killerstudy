import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function analyzeText(text: string) {
  // Simple text analysis to extract key concepts
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  const wordFrequency = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const keyTerms = Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);

  return {
    sentences,
    keyTerms,
    wordCount: words.length,
    readingTime: Math.ceil(words.length / 200), // Assuming 200 words per minute
  };
}

export function generateQuiz(text: string) {
  const analysis = analyzeText(text);
  const sentences = analysis.sentences;

  // Generate simple quiz questions
  return sentences.slice(0, 5).map((sentence) => {
    const words = sentence.split(' ');
    const randomIndex = Math.floor(Math.random() * words.length);
    const answer = words[randomIndex];
    const question = sentence.replace(answer, '_____');

    return {
      id: crypto.randomUUID(),
      question,
      answer,
      options: [
        answer,
        ...analysis.keyTerms.filter((term) => term !== answer).slice(0, 3),
      ].sort(() => Math.random() - 0.5),
    };
  });
}
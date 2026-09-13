import nlp from 'compromise/one';

import type { FaqItem } from '@/data/faqData';

/**
 * These words carry little meaning for FAQ retrieval. Removing them makes
 * questions such as "Can you tell me how to submit my project?" compare
 * mainly on the useful terms: "submit" and "project".
 */
const STOP_WORDS = new Set([
  'a',
  'about',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'can',
  'do',
  'for',
  'from',
  'get',
  'how',
  'i',
  'if',
  'in',
  'is',
  'it',
  'me',
  'my',
  'of',
  'on',
  'or',
  'should',
  'so',
  'tell',
  'the',
  'to',
  'what',
  'when',
  'where',
  'which',
  'why',
  'with',
  'you',
  'your',
]);

const FILLER_WORDS = new Set([
  'please',
  'question',
  'thing',
  'things',
  'want',
  'need',
  'know',
  'help',
]);

/**
 * Small domain-neutral synonym groups improve paraphrase matching while
 * keeping the retrieval explainable. They are applied after tokenization so
 * cosine similarity still ranks FAQ question vectors explicitly.
 */
const TOKEN_ALIASES: Record<string, string> = {
  begin: 'beginner',
  beginners: 'beginner',
  beginner: 'beginner',
  finished: 'completed',
  complete: 'completed',
  completed: 'completed',
  final: 'completed',
  put: 'submit',
  upload: 'submit',
  uploaded: 'submit',
  turn: 'submit',
  turned: 'submit',
  work: 'project',
  projects: 'project',
  resume: 'portfolio',
  cv: 'portfolio',
  collection: 'portfolio',
};

export const FAQ_MATCH_THRESHOLD = 0.17;

/**
 * Normalizes text into meaningful tokens using compromise's browser-safe NLP
 * tokenizer, then removes punctuation, stop words, and low-value filler.
 */
export function preprocessText(text: string): string[] {
  const cleanedText = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = (nlp(cleanedText).terms().out('array') as string[])
    .map((token) => token.toLowerCase().trim())
    .filter((token) => token.length > 1)
    .filter((token) => !STOP_WORDS.has(token))
    .filter((token) => !FILLER_WORDS.has(token))
    .map((token) => TOKEN_ALIASES[token] ?? token);

  return tokens;
}

function termFrequency(tokens: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  tokens.forEach((token) => counts.set(token, (counts.get(token) ?? 0) + 1));
  return counts;
}

/**
 * Computes cosine similarity between two token lists. The dot product
 * measures shared terms, while the vector lengths prevent longer questions
 * from winning only because they contain more words.
 */
export function cosineSimilarity(leftTokens: string[], rightTokens: string[]): number {
  if (!leftTokens.length || !rightTokens.length) return 0;

  const leftVector = termFrequency(leftTokens);
  const rightVector = termFrequency(rightTokens);
  const vocabulary = new Set([...leftVector.keys(), ...rightVector.keys()]);

  let dotProduct = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  vocabulary.forEach((token) => {
    const leftValue = leftVector.get(token) ?? 0;
    const rightValue = rightVector.get(token) ?? 0;
    dotProduct += leftValue * rightValue;
    leftMagnitude += leftValue ** 2;
    rightMagnitude += rightValue ** 2;
  });

  if (!leftMagnitude || !rightMagnitude) return 0;
  return dotProduct / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

export type FaqMatch = {
  faq: FaqItem;
  score: number;
  confidence: number;
};

export function matchFaqQuestion(question: string, faqs: FaqItem[]): FaqMatch | null {
  const queryTokens = preprocessText(question);
  if (!queryTokens.length) return null;

  const rankedMatches = faqs
    .map((faq) => {
      const score = cosineSimilarity(queryTokens, preprocessText(faq.question));
      return {
        faq,
        score,
        confidence: Math.round(score * 100),
      };
    })
    .sort((left, right) => right.score - left.score);

  const bestMatch = rankedMatches[0];
  return bestMatch && bestMatch.score >= FAQ_MATCH_THRESHOLD ? bestMatch : null;
}
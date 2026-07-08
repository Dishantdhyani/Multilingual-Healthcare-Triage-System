// Shared interfaces for MedTriage AI & MindEase Suite
export const MODULE_VERSION = "1.0.0";

export interface Prediction {
  disease: string;
  confidence: number;
  similarity: number;
  severity: string;
  specialty: string;
}

export interface SimilarCase {
  case_id: number;
  disease: string;
  symptom_text: string;
  similarity: number;
}

export interface TriageResult {
  predictions: Prediction[];
  similar_cases: SimilarCase[];
  detected_symptoms: string[];
}

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  mood: string;
  date: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  text: string;
  timestamp: string;
  likes: number;
}

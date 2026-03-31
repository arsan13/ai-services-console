export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  content: string;
}
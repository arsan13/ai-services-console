export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp?: Date;
}

export interface ChatResponse {
  content: string;
}
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatResponse, Message } from '../../features/chat/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  messages = signal<Message[]>([]);
  loading = signal(false);

  constructor(private http: HttpClient) {}

  sendMessage(text: string) {
    this.loading.set(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    this.messages.update((m) => [...m, userMessage]);

    this.http.get<ChatResponse>(`http://localhost:8080/api/ai/chat?message=${text}`).subscribe({
      next: (res: ChatResponse) => {
        const botMessage: Message = {
          id: crypto.randomUUID(),
          role: 'bot',
          content: res.content,
          timestamp: new Date(),
        };
        this.messages.update((m) => [...m, botMessage]);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}

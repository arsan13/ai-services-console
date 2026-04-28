import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChatRequest, ChatResponse, Message } from '../../features/chat/message.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private apiUrl = `${environment.apiUrl}/ai/chat`;

  messages = signal<Message[]>([]);
  loading = signal(false);

  constructor(private http: HttpClient) {}

  sendMessage(message: string) {
    this.loading.set(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    this.messages.update((m) => [...m, userMessage]);

    const body: ChatRequest = { message };
    this.http.post<ChatResponse>(`${this.apiUrl}`, body).subscribe({
      next: (res: ChatResponse) => {
        this.handleResponse(res.content);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        const msg = err.message ?? 'Something went wrong';
        this.handleResponse(msg);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  private handleResponse(content: string | undefined) {
    const botMessage: Message = {
      id: crypto.randomUUID(),
      role: 'bot',
      content: content || "No response",
      timestamp: new Date(),
    };
    this.messages.update((m) => [...m, botMessage]);
    this.loading.set(false);
  }
}

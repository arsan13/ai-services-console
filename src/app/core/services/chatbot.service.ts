import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChatRequest, ChatResponse, Message } from '../../features/chat/message.model';
import { ApiResponse } from '../api.model';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
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
    this.http.post<ApiResponse<ChatResponse>>(`http://localhost:8080/api/ai/chat`, body).subscribe({
      next: (res: ApiResponse<ChatResponse>) => {
        this.handleResponse(res.data?.content);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        const msg =
          err.error?.message ??
          err.message ??
          'Something went wrong';
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

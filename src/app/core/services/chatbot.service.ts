import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { ChatRequest, ChatResponse, Message } from '../../features/chat/message.model';
import { environment } from '../../../environments/environment';
import { ChatTypeCode } from '../models/chat-type.model';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private apiUrl = `${environment.apiUrl}/ai/chat`;
  private readonly http = inject(HttpClient);

  messages = signal<Message[]>([]);
  loading = signal(false);

  private cancelRequest$ = new Subject<void>();

  stopMessage() {
    this.cancelRequest$.next();
    this.loading.set(false);
  }

  sendMessage(message: string, chatType: ChatTypeCode) {
    this.loading.set(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    this.messages.update((m) => [...m, userMessage]);

    const body: ChatRequest = { message };
    this.http.post<ChatResponse>(`${this.apiUrl}/${chatType}`, body).pipe(
      takeUntil(this.cancelRequest$)
    ).subscribe({
      next: (res: ChatResponse) => {
        this.handleResponse(res.content);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.handleResponse(err.message ?? 'Something went wrong');
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  deleteConversation(chatType: ChatTypeCode) {
    return this.http.delete(`${this.apiUrl}/${chatType}/conversation`);
  }

  clearMessages() {
    this.messages.set([]);
  }

  private handleResponse(content: string | undefined) {
    const botMessage: Message = {
      id: crypto.randomUUID(),
      role: 'bot',
      content: content || "No response",
      timestamp: new Date(),
    };
    this.messages.update((m) => [...m, botMessage]);
  }
}

import { Injectable, signal } from '@angular/core';
import { Message } from '../../features/chat/message.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotStreamService {
  private apiUrl = `${environment.apiUrl}/ai/stream`;

  messages = signal<Message[]>([]);

  constructor() {}

  sendMessage(text: string) {

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text
    };
    this.messages.update(m => [...m, userMessage]);

    // Add placeholder for bot
    const botMessage: Message = {
      id: crypto.randomUUID(),
      role: 'bot',
      content: ''
    };
    this.messages.update(m => [...this.messages(), botMessage]);

    // SSE connection
    const eventSource = new EventSource(`${this.apiUrl}?message=${encodeURIComponent(text)}`);

    eventSource.onmessage = (event) => {
      // Append chunk to bot message
      botMessage.content += event.data;
      this.messages.update(m => [...m]);
    };

    eventSource.onerror = (err) => {
      console.error('SSE error', err);
      botMessage.content += "\n[Error receiving stream]";
      this.messages.update(m => [...m]);
      eventSource.close();
    };

    eventSource.onopen = () => {
      console.log('SSE connection opened');
    };

  }
}
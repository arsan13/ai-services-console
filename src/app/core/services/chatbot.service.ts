import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../../features/chat/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  messages = signal<Message[]>([]);

  constructor(private http: HttpClient) { }

  sendMessage(text: string) {

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    this.messages.update(m => [...m, userMessage]);

    this.http.post<any>('http://localhost:3000/chat', { message: text })
      .subscribe(res => {

        const botMessage: Message = {
          id: crypto.randomUUID(),
          role: 'bot',
          content: res.reply,
          timestamp: new Date()
        };

        this.messages.update(m => [...m, botMessage]);
      });
  }
}
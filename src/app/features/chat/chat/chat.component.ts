import { Component, ViewChild, ElementRef, effect, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChatbotService } from '../../../core/services/chatbot.service';

import { MarkdownModule } from 'ngx-markdown';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const MAX_HISTORY = 20;

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    MarkdownModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  message: string = '';

  history: string[] = [];
  historyIndex: number = -1;

  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;

  chatService = inject(ChatbotService);

  constructor() {
    effect(() => {
      // Watch messages signal and scroll to bottom when messages change
      this.chatService.messages();
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }

  scrollToBottom(): void {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }
  }

  deleteConversation() {
    this.chatService.deleteConversation().subscribe({
      next: () => {
        this.chatService.clearMessages();
        this.message = '';
        this.history = [];
        this.historyIndex = -1;
      }
    });
  }

  send() {
    const trimmedMsg = this.message.trim();
    if (!trimmedMsg) {
      return;
    };

    if (this.history[0] !== trimmedMsg) {
      this.history.unshift(trimmedMsg);
    }
    if (this.history.length > MAX_HISTORY) {
      this.history.pop();
    }

    this.chatService.sendMessage(trimmedMsg);

    this.historyIndex = -1;
    this.message = '';
  }

  handleKey(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.navigateHistory(1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.navigateHistory(-1);
    }
  }

  navigateHistory(direction: number) {
    if (this.history.length === 0) return;

    this.historyIndex += direction;

    if (this.historyIndex >= this.history.length) {
      this.historyIndex = this.history.length - 1;
    } else if (this.historyIndex < -1) {
      this.historyIndex = -1;
    }

    if (this.historyIndex === -1) {
      this.message = '';
    } else {
      this.message = this.history[this.historyIndex];
    }
  }
}

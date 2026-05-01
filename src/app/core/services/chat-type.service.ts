import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatType, ChatTypeCode } from '../models/chat-type.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ChatTypeService {
  private readonly http = inject(HttpClient);
  private readonly userService = inject(UserService);
  private readonly chatTypesUrl = `${environment.apiUrl}/ai/chat/types`;

  private readonly chatTypesSignal = signal<ChatType[]>([]);
  private readonly selectedChatTypeCodeSignal = signal<ChatTypeCode | null>(null);
  readonly loading = signal(false);

  readonly chatTypes = this.chatTypesSignal.asReadonly();

  readonly allowedChatTypes = computed(() => {
    const chatTypes = this.chatTypesSignal();
    return chatTypes.filter((chatType) => this.userService.hasPermission(chatType.permission));
  });

  readonly selectedChatType = computed(() => {
    const allowedChatTypes = this.allowedChatTypes();
    if (allowedChatTypes.length === 0) {
      return null;
    }

    const selectedCode = this.selectedChatTypeCodeSignal();
    return allowedChatTypes.find((chatType) => chatType.code === selectedCode) ?? allowedChatTypes[0];
  });

  readonly selectedChatTypeCode = computed(() => this.selectedChatType()?.code ?? null);

  load(): void {
    if (this.chatTypesSignal().length > 0 || this.loading()) {
      return;
    }

    this.loading.set(true);

    this.http.get<ChatType[]>(this.chatTypesUrl).pipe(
      catchError(() => of([])),
      finalize(() => {
        this.loading.set(false);
      })
    ).subscribe((chatTypes) => {
      this.chatTypesSignal.set(chatTypes);
    });
  }

  selectChatType(code: ChatTypeCode): void {
    this.selectedChatTypeCodeSignal.set(code);
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ChatComponent } from './chat.component';
import { ChatbotService } from '../../../core/services/chatbot.service';
import { ChatTypeService } from '../../../core/services/chat-type.service';

describe('Chat', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  const chatbotServiceMock = {
    messages: signal([]),
    loading: signal(false),
    stopMessage: vi.fn(),
    deleteConversation: vi.fn().mockReturnValue(of(null)),
    clearMessages: vi.fn(),
    sendMessage: vi.fn()
  };

  const chatTypeServiceMock = {
    allowedChatTypes: signal([
      {
        code: 'aviation',
        displayName: 'Aviation Fuel Operations Chat',
        permission: 'chat:aviation:use'
      }
    ]),
    selectedChatType: signal({
      code: 'aviation',
      displayName: 'Aviation Fuel Operations Chat',
      permission: 'chat:aviation:use'
    }),
    selectedChatTypeCode: signal('aviation'),
    loading: signal(false),
    load: vi.fn(),
    selectChatType: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        { provide: ChatbotService, useValue: chatbotServiceMock },
        { provide: ChatTypeService, useValue: chatTypeServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

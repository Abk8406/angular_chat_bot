import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OpenAiService } from './openai.service';

class Message {
  text?: string;
  type: MessageType;
}

enum MessageType {
  Bot = 'bot',
  User = 'user',
  Loading = 'loading'
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer: ElementRef;
  @Input() public display: string;

  public form: FormGroup;
  public messages: Array<Message> = [];
  private canSendMessage = true;

  constructor(private formBuilder: FormBuilder, private openAiService: OpenAiService) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      message: ['']
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  public onClickSendMessage(): void {
    const message = this.form.get('message').value;

    if (message && this.canSendMessage) {
      const userMessage: Message = { text: message, type: MessageType.User };
      this.messages.push(userMessage);
      this.form.get('message').setValue('');
      this.form.updateValueAndValidity();
      this.getBotMessage(message);
    }
  }

  private getBotMessage(userInput: string): void {
    this.canSendMessage = false;
    const waitMessage: Message = { type: MessageType.Loading };
    this.messages.push(waitMessage);

    this.openAiService.getAiResponse(userInput).subscribe(
      (response) => {
        this.messages.pop();
        const botMessage: Message = { text: response.message, type: MessageType.Bot };
        this.messages.push(botMessage);
        this.canSendMessage = true;
      },
      (error) => {
        this.messages.pop();
        const errorMessage: Message = { text: 'Error getting response from AI.', type: MessageType.Bot };
        this.messages.push(errorMessage);
        this.canSendMessage = true;
      }
    );
  }

  public onClickEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onClickSendMessage();
    }
  }

  private scrollToBottom(): void {
    if (this.messageContainer) {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }
  }
}

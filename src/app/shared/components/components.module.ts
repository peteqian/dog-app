import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from './header';
import { MessagesModule } from './messages/messages.module';

@NgModule({
  imports: [CommonModule, HeaderModule, MessagesModule],
  exports: [HeaderModule, MessagesModule]
})
export class ComponentModule {}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CARD_KEY } from 'src/app/modules/shared/constants/app.constants';

import { IListCard } from 'src/app/modules/shared/interfaces/list-card.model';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss']
})
export class ListCardComponent {

  @Input() public listNumber: number = -1;
  @Input() public list: string = '';
  @Input() public allItems: IListCard[] = [];
  @Output() public deleteEvent = new EventEmitter<number>();

  onDragOver(ev: any) {
    ev.preventDefault();
  }

  onDragStart(ev: any, item: IListCard) {
    ev.dataTransfer.setData(CARD_KEY, JSON.stringify({...item}));
  }

  deleteCard(id: number | undefined) {
    this.deleteEvent.emit(id);
  }
}

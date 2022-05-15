import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

import { IListCard } from '../interfaces/list-card.model';
const taskList = require('../../../../assets/data/task-list.json');

@Injectable({
  providedIn: 'root'
})
export class CardListService {

  constructor() { }

  public getTaskList(): Observable<IListCard[]> {
    return of(taskList);
  }
}

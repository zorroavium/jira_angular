import { Component } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import { CARD_KEY } from '../shared/constants/app.constants';
import { IListCard } from 'src/app/modules/shared/interfaces/list-card.model';
import { CardListService } from 'src/app/modules/shared/services/card-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class HomeComponent {

  private readonly CURRENT_STATE = 'currentState';
  private readonly CURRENT_STATE_LIST = 'currentStateList';

  public jiraLists: string[] = ['Todo', 'In Progress', 'Etc'];
  public jiraListCards: IListCard[] = [];
  public closeResult = '';
  public newJiraList: string | null = null;
  public formModal: IListCard = this.getNewFormModel();

  constructor(private _cls: CardListService, private modalService: NgbModal, config: NgbModalConfig) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.checkOldState();
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  drop(ev: any, newList: string) {
    ev.preventDefault();
    var data: IListCard = JSON.parse(ev.dataTransfer.getData(CARD_KEY));
    
    this.jiraListCards.forEach(item => {
      if(item.id === data.id) {
        item.status = newList.toLocaleLowerCase();
      }
    });

    this.sortByDateToListDropped(newList);
    this.saveState(this.CURRENT_STATE, this.jiraListCards);
  }

  sortByDateToListDropped(status: string) {
    let listToSort = [...this.jiraListCards.filter(x => x.status === status.toLocaleLowerCase())];
    this.jiraListCards = [...this.jiraListCards.filter(x => x.status !== status.toLocaleLowerCase())];
    listToSort.sort((a, b) => new Date(b.creationDateTime).getTime() - new Date(a.creationDateTime).getTime());
    this.jiraListCards = [...this.jiraListCards, ...listToSort];
  }

  allowDrop(ev: any) {
    ev.preventDefault();
  }

  initFormModel(index: number) {
    this.formModal = this.getNewFormModel();
    this.formModal.status = index.toString();
  }

  deleteList(index: number, list: string) {
    this.jiraLists.splice(index, 1);
    this.jiraListCards = this.jiraListCards.filter(item => item.status !== list.toLocaleLowerCase());
    
    this.saveState(this.CURRENT_STATE_LIST, this.jiraLists);
    this.saveState(this.CURRENT_STATE, this.jiraListCards);
  }

  onDeleteEvent(id: number) {
    this.jiraListCards = this.jiraListCards.filter(item => item.id !== id);
    this.saveState(this.CURRENT_STATE, this.jiraListCards);
  }

  saveNewList() {
    this.jiraLists.push(this.newJiraList ?? '');
    this.saveState(this.CURRENT_STATE_LIST, this.jiraLists);
    this.newJiraList = null;
  }

  save() {
    this.formModal.status = this.jiraLists[+this.formModal.status].toLocaleLowerCase();
    this.formModal.id = (new Date()).getTime();
    this.formModal.creationDateTime = (new Date()).toISOString();

    this.jiraListCards.push(this.formModal);
    this.saveState(this.CURRENT_STATE, this.jiraListCards);
  }

  private saveState(key: string, jiraListCards: IListCard[] | string[]) {
    localStorage.setItem(key, JSON.stringify(jiraListCards));
  }

  private getTaskList() {
    let subs: Subscription = this._cls.getTaskList().subscribe((res) => {
      this.jiraListCards = res;
      if(subs) {
        subs.unsubscribe();
      }
    });
  }

  private checkOldState() {
    const prevState = localStorage.getItem(this.CURRENT_STATE);
    const prevStateList = localStorage.getItem(this.CURRENT_STATE_LIST);

    if (prevState) {
      this.jiraListCards = JSON.parse(prevState);
    } else {
      this.getTaskList();
    }

    if (prevStateList) {
      this.jiraLists = JSON.parse(prevStateList);
    }
  }

  private getNewFormModel(): IListCard {
    return {
      title: '',
      description: '',
      status: '',
      priority: '',
      estimate: '',
      storyPoints: 0,
      creationDateTime: ''
    };
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ListCardComponent } from './components/list-card/list-card/list-card.component';
import { CardListService } from 'src/app/modules/shared/services/card-list.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    ListCardComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule
  ],
  providers: [CardListService]
})
export class HomeModule { }

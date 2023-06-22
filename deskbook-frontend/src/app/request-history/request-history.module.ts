import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestHistoryRoutingModule } from './request-history-routing.module';
import { RequestHistoryComponent } from './request-history/request-history.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [RequestHistoryComponent],
  imports: [
    CommonModule,
    RequestHistoryRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
  ],
})
export class RequestHistoryModule {}

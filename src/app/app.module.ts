import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgIdleModule } from '@ng-idle/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgIdleModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

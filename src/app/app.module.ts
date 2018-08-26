import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { EventsComponent } from './events/events.component';
import { AppComponent } from './app.component';
import { EventsService } from './events/events.service';
import { FormsModule }   from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [EventsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

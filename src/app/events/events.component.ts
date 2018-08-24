import { Component, OnInit } from '@angular/core';
import { EventsService } from './events.service';
import { Event } from './events.models';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
    public events: Array<Event>;
    public imageSrc: string;
    public test: SafeUrl;

    constructor(private eventsService: EventsService) { }

    ngOnInit() {
        this.events = new Array<Event>();

        this.eventsService.getEventsList().subscribe((response: Array<Event>) => {
            if (response) {
                this.events = response;
                
                if (this.events && this.events.length > 0 && this.events[0].images && this.events[0].images.length > 0) {
                    this.getImage(this.events[0].id, this.events[0].images[0].id);
                }
            }
        });
    }

    public getImage(eventID: string, mediaID: string) {
        if (!eventID || mediaID) {
            return;
        }
        this.eventsService.getEventImage(eventID, mediaID)
        .subscribe((imageResponse: string) => {
            this.test = imageResponse;
        });
    }

}
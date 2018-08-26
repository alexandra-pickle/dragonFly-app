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
    public isLoading = false;
    public events: Array<Event>;
    public imageSrc: string;
    public test: SafeUrl;

    constructor(private eventsService: EventsService) { }

    ngOnInit() {
        this.isLoading = true;
        this.events = new Array<Event>();

        //  get all the events
        this.eventsService.getEventsList()
            .subscribe((response: Array<Event>) => {
                if (response) {
                    this.events = response;
                    
                    if (this.events && this.events.length > 0) {

                        //  get status for each event
                        this.events.forEach(event => {
                            if (event) {
                                event.isDisplayComments = false;
                                event.isGoing = false;
                                this.eventsService.getEventStatus(event.id).subscribe(statusResponse => {
                                    if (statusResponse && statusResponse !== undefined
                                        && statusResponse.coming !== undefined) {
                                        event.isGoing = statusResponse.coming;
                                    } 
                                }
                            }
                        });
                    }
                }
                this.isLoading = false;
            },
            error => {
                console.log(error);
                this.isLoading = false;
            });
    }

    public getThumbnailImage(event: Event) {
        if (event && event.images && event.images.length > 0) {
            this.eventsService.getEventImage(event.id, event.images[0].id)
            .subscribe((imageResponse) => {
                if (imageResponse) {
                    this.events.find(x => x.id === event.id).isDisplayingImage = true;
                    return imageResponse;
                }
            });
        }
    }
}
import { Component, OnInit } from '@angular/core';
import { EventsService } from './events.service';
import { Event } from './events.models';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
    public startIndex: number;
    public endIndex: number;

    constructor(private eventsService: EventsService, private sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.isLoading = true;
        this.startIndex = 0;
        this.endIndex = 10;

        this.events = new Array<Event>();

        //  get all the events
        this.eventsService.getEventsList()
            .subscribe((response: Array<Event>) => {
                if (response) {
                    this.events = response;
                    
                    if (this.events && this.events.length > 0) {

                        //  get status for each event
                        this.events.forEach((event, eventIndex) => {
                            if (event) {
                                event.isDisplayComments = false;
                                event.isGoing = false;
                                this.eventsService.getEventStatus(event.id).subscribe(statusResponse => {
                                    if (statusResponse && statusResponse !== undefined
                                        && statusResponse['coming'] !== undefined) {
                                        event.isGoing = statusResponse['coming'];
                                    } 
                                });

                                this.getThumbnailImage(event);
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
        let eventIndex = this.events.indexOf(event);

        if (!eventIndex || (eventIndex < this.startIndex) || (eventIndex > this.endIndex)) {
            return;
        }
        console.log(eventIndex);

        if (event && event.images && event.images.length > 0 && this.events.indexOf(event) < 10) {
            this.eventsService.getEventImage(event.id, event.images[0].id)
                .subscribe(imageUrl => {
                    let eventFound = this.events.find(x => x.id === event.id);
                    eventFound.imageSrc = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
                });
        }
    }

    public loadMoreEvents() {
        this.endIndex += 10;
    }

    public changeEventStatus(eventID: number, isGoing: boolean) {
        this.eventsService.updateEventStatus(eventID, isGoing).subscribe(response => {
        });
    }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from './events.service';
import { Event } from './events.models';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnDestroy {
    public isLoading = false;
    public events: Array<Event>;
    public imageSrc: string;
    public test: SafeUrl;
    public startIndex: number;
    public endIndex: number;
    private subscriptions = new Array<Subscription>();

    constructor(private eventsService: EventsService, private sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.isLoading = true;
        this.startIndex = 0;
        this.endIndex = 10;

        this.events = new Array<Event>();

        //  get all the events
        this.subscriptions.push(this.eventsService.getEventsList()
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

                                //  get event's thumbnail image
                                this.getThumbnailImage(event, eventIndex);
                            }
                        });
                    }
                }
                this.isLoading = false;
            },
            error => {
                console.log(error);
                this.isLoading = false;
            }));
    }


    /**
     * Method returns event's first image
     * @param event - event
     * @param eventIndex - event's index
     */
    public getThumbnailImage(event: Event, eventIndex: number) {
        if (event.images && event.images.length > 0 && 
            eventIndex < this.endIndex) {
            
            let eventFound = this.events.find(x => x.id === event.id);

            this.subscriptions.push
                (this.eventsService.getEventImage(event.id, event.images[0].id)
                    .subscribe(imageUrl => {
                        if (imageUrl) {
                            eventFound.imageSrc = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
                        }      
                    },
                    error => {
                        //  if getting image resulted in an error display no image available
                        eventFound.imageSrc = './assets/images/no-image-available.png';
                        eventFound.isNoImageAvailable = true;
                    }));
        } else if (event.images.length === 0) {
            event.imageSrc = './assets/images/no-image-available.png';
            event.isNoImageAvailable = true;
        }
    }


    public ngOnDestroy() {
        //  destroy all subscriptions
        this.subscriptions.forEach(subscription => { subscription.unsubscribe()});
    }


    /**
     * Method updates indexes to for events loading
     * and loads events' images
     */
    public loadMoreEvents() {
        this.endIndex += 10;
            for (let i= this.startIndex+10; i <= this.endIndex; i++) {
                this.getThumbnailImage(this.events[i], i);
            }
    }

    /**
     * Method updates status for a particular event
     * @param eventID - event ID
     * @param isGoing - event status
     */
    public changeEventStatus(eventID: string, isGoing: boolean) {
        this.subscriptions.push
        (this.eventsService.updateEventStatus(eventID, isGoing)
            .subscribe(response => {
                this.events.find(x => x.id === eventID).isStatusUpdateError = false;
            },
            error => {
                this.events.find(x => x.id === eventID).isStatusUpdateError = true;
            }));
    }
}
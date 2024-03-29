import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Event } from './events.models';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

@Injectable()
export class EventsService {
    private configUrl = 'http://dev.dragonflyathletics.com:1337/api/dfkey/';
    private userName = 'anything';
    private headers: HttpHeaders;

    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders();
        this.headers = this.headers.append("Authorization", "Basic " + btoa("anything:evalpass"));
        this.headers = this.headers.append("Content-Type", "application/json");
    }

    /**
     * Method returns a list of events
     * GET {apiRoot}/events
     */
    public getEventsList(): Observable<Array<Event>> {

        return this.http.get<Array<Event>>(`${this.configUrl}events`, { headers: this.headers })
            .pipe(
                retry(10),
                catchError(this.handleError)
            );
    }

    /**
     * Method returns event's image
     * @param eventID - event ID
     * @param mediaID - image ID
     */
    public getEventImage(eventID: string, mediaID: string) {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("anything:evalpass"));
        headers = headers.append("Content-Type", "image/jpeg");
        return this.http.get(`${this.configUrl}events/${eventID}/media/${mediaID}`, { headers: headers, responseType: "blob" })
        .pipe(
            map(blob => URL.createObjectURL(blob)),
            retry(10),
            catchError(this.handleError)
        );
    }

    /**
     * Method returns event's status
     * @param eventID - event ID
     */
    public getEventStatus(eventID: string){
        return this.http.get
        (`${this.configUrl}events/${eventID}/status/${this.userName}`, { headers: this.headers })
        .pipe(
            retry(10),
            catchError(this.handleError)
        );
    }

    /**
     * Method updates status for a particular event
     * @param eventID - event ID
     * @param status - event's status
     */
    public updateEventStatus(eventID: string, status: boolean) {
        let parameters = {
            coming: status     
        };

        return this.http.put
        (`${this.configUrl}events/${eventID}/status/${this.userName}`, parameters, { headers: this.headers })
        .pipe(
            retry(10),
            catchError(this.handleError)
        );
    }    

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
            console.log(error.message);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    };


}
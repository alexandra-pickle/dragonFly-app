import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Event } from './events.models';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable()
export class EventsService {
    private configUrl = 'http://dev.dragonflyathletics.com:1337/api/dfkey/';
    private headers: HttpHeaders;

    constructor(private http: HttpClient, private domSanitizer: DomSanitizer) {
    }

    /**
     * Method returns a list of events
     * GET {apiRoot}/events
     */
    public getEventsList(): Observable<Array<Event>> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("anything:evalpass"));
        headers = headers.append("Content-Type", "application/x-www-form-urlencoded");
        return this.http.get<Array<Event>>(`${this.configUrl}events`, { headers: headers })
            .pipe(
                retry(10),
                catchError(this.handleError)
            );
    }

    /**
     * Method returns an event image
     */
    public getEventImage(eventID: string, mediaID: string): Observable<SafeUrl> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("anything:evalpass"));
        headers = headers.append("Content-Type", "image/jpeg");

        return this.http.get(`${this.configUrl}events/${eventID}/media/${mediaID}`, { headers: headers, responseType: "blob" })
            .pipe(
                map(blob => { 
                    let urlCreator = window.URL;
                    let result = this.domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(blob));
                    return result;}),
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
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
            console.log(error.message);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    };

    /**
     * Method returns event's meadia
     * @param eventId - eventID
     * @param mediaID - type of meda
     * GET {apiRoot}/events/{eventId}/media/{mediaId}
     */
    public getEventMedia(eventId: number, mediaId) {
        return null;
    }

    /**
     * Method returns status of a particular event for a user
     * @param eventId - event ID
     * @param userName - user name
     * GET {apiRoot}/events/{eventId}/status/{userName}
     */
    public getEventStatus(eventId: number, userName: number) {
        return null;
    }
}
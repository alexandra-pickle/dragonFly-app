export interface Event {
    id: string,
    date: Date,
    name: string,
    location: EventLocation,
    description: string,
    images: Array<EventImage>,
    coments: Array<EventComment>,
    isGoing?: boolean,
    isStatusUpdateError?: boolean,
    isDisplayComments?: boolean,
    imageSrc?: any,
    isNoImageAvailable?: boolean;
}

export interface EventImage {
    id: string,
    caption: string
}

export interface EventComment {
    from: string,
    text: string
}

export interface EventLocation {
    address: string,
    city: string,
    name: string,
    state: string 
}

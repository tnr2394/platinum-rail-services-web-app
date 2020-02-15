import { LOCALE_ID, Inject, Injectable } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { DatePipe } from '@angular/common';

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
    constructor(@Inject(LOCALE_ID) private locale: string) {
        super();
    }

    // you can override any of the methods defined in the parent class

    month(event: CalendarEvent): string {
        return `<b>${new DatePipe(this.locale).transform(
            event.start,
            'h:m a',
            this.locale
        )}</b> ${event.title}`;
    }

    week(event: CalendarEvent): string {
        var temp = `${event.title}`
        if(temp == "Slot-1") return `<b>${event.title}</b> Before Lunch`
        else return `<b>${event.title}</b> After Lunch`
        // return `<i>${event.title}</i>`
        // return `<b>${new DatePipe(this.locale).transform(
        //     event.start,
        //     'h:m a',
        //     this.locale
        // )}</b> ${event.title}`;
    }

    day(event: CalendarEvent): string {
        return `<b>${new DatePipe(this.locale).transform(
            event.start,
            'h:m a',
            this.locale
        )}</b> ${event.title}`;
    }
}
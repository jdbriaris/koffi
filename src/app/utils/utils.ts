import { Subscription } from 'rxjs/Subscription';
import { queue } from 'rxjs/scheduler/queue';
import {NgZone} from "@angular/core";

export class ZoneScheduler {
    constructor(public zone: NgZone) {}

    schedule(...args): Subscription {
        return <Subscription>this.zone.run(() => queue.schedule.apply(queue, args));
    }
}
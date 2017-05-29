import { Subscription } from 'rxjs/Subscription';
import { queue } from 'rxjs/scheduler/queue';
import {NgZone} from "@angular/core";
import {User} from "../auth/user";

export class ZoneScheduler {
    constructor(public zone: NgZone) {}

    schedule(...args): Subscription {
        return <Subscription>this.zone.run(() => queue.schedule.apply(queue, args));
    }
}

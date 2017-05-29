import {EventEmitter, Injectable, NgZone} from "@angular/core";
/**
 * A mock implementation of {@link NgZone}.
 */
@Injectable()
export class MockNgZone extends NgZone {
    /** @internal */
    private _mockOnStable: EventEmitter<any> = new EventEmitter(false);

    constructor() { super({enableLongStackTrace: false}); }

    get onStable() { return this._mockOnStable; }

    run(fn: Function): any { return fn(); }

    runOutsideAngular(fn: Function): any { return fn(); }

    simulateZoneExit(): void {  }
}
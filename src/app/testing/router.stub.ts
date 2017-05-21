import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {NavigationExtras} from "@angular/router";

@Injectable()
export class RouterStub {
   navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
       return Promise.resolve(true);
   }
}

@Injectable()
export class ActivatedRouteStub {
    // ActivatedRoute.params is Observable
    private subject = new BehaviorSubject(this.testParams);
    params = this.subject.asObservable();

    // Test parameters
    private _testParams: {};
    get testParams() { return this._testParams; }
    set testParams(params: {}) {
        this._testParams = params;
        this.subject.next(params);
    }

    // ActivatedRoute.snapshot.params
    get snapshot() {
        return { params: this.testParams };
    }
}
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class RouterStub {
    navigate() {};
}

@Injectable()
export class ActivatedRouteStub {
    private _testParams: {};
    private subject = new BehaviorSubject(this._testParams);

    params = this.subject.asObservable();

    set testParams(params: {}) {
        this._testParams = params;
        this.subject.next(params);
    };
}
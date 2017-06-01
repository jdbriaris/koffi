import {Injectable} from "@angular/core";

@Injectable()
export class MockActivatedRoute {
    readonly _root: MockActivatedRoute = null;

    get root(): MockActivatedRoute {
        return this._root;
    }
}

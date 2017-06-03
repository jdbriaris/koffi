import {Injectable} from "@angular/core";

@Injectable()
export class MockActivatedRoute {
    readonly _root: MockActivatedRoute = null;
    readonly _parent: MockActivatedRoute = null;

    get root(): MockActivatedRoute {
        return this._root;
    }

    get parent(): MockActivatedRoute {
        return this._parent;
    }
}

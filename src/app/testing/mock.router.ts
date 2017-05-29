import {Injectable} from "@angular/core";

@Injectable()
export class MockRouter {
    private navigateReturnPromise: Promise<boolean>;


    navigate(): Promise<boolean> {
        return this.navigateReturnPromise;
    }

    //region Mock Setters

    setNavigateReturnPromise(promise: Promise<boolean>): void {
        this.navigateReturnPromise = promise;
    }

    //endregion
}
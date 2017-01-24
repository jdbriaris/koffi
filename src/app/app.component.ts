import {Component} from '@angular/core';
import {FirebaseService} from "./services/firebase.service";
import './styles/styles.scss';

@Component({
    moduleId: 'module.id',
    selector: 'xfit-app',
    templateUrl: './app.component.html'
})
export class AppComponent {

    constructor(private firebaseService: FirebaseService) {
        firebaseService.connect();
    }
}
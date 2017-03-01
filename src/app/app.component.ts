import {Component} from '@angular/core';
import * as firebase from 'firebase';
import './styles/styles.scss';

const config = {
    apiKey: "AIzaSyB5RBALHF5YGi_TK0M-hVyuQdkmHWACQH0",
    authDomain: "koffi-bd880.firebaseapp.com",
    databaseURL: "https://koffi-bd880.firebaseio.com",
    storageBucket: "koffi-bd880.appspot.com",
    messagingSenderId: "154364068514"
};

@Component({
    moduleId: 'module.id',
    selector: 'xfit-app',
    templateUrl: './app.component.html'
})
export class AppComponent {
    constructor(){
        firebase.initializeApp(config);
    }
}
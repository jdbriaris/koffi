import {FirebaseAuthStub} from "../testing/firebase.app.stub";
import Auth = firebase.auth.Auth;
import {FirebaseService} from "./firebase.service";

describe('A FirebaseService', () => {
    let firebaseAuth: Auth;

    beforeEach(() => {
        firebaseAuth = new FirebaseAuthStub();
        spyOn(firebaseAuth, 'signInWithEmailAndPassword');
    });

    it('calls initializeApp on construction', () => {
        let service = new FirebaseService(firebaseAuth);

        service.logIn();

        expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
    });

});
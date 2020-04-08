/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, customElement, css, property, query } from 'lit-element';
// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
// This element is connected to the Redux store.
import { store } from '../store.js';
// These are the actions needed by this element.
import { firebase } from '@firebase/app';
import '@firebase/auth';
import '@material/mwc-dialog';
import '@material/mwc-textfield';
import '@material/mwc-button';
// These are the actions needed by this element.
import { userDataSelectUser } from '../actions/users.js';
// We are lazy loading its reducer.
import userdata, { userdataSelector } from '../reducers/users.js';
if (userdataSelector(store.getState()) === undefined) {
    store.addReducers({
        userdata
    });
}
let UserLogin = class UserLogin extends connect(store)(PageViewElement) {
    constructor() {
        super(...arguments);
        this.displayName = '';
        this.email = '';
        this.photoURL = '';
        this.errorCode = '';
        this.errorMessage = '';
        this.credential = '';
    }
    static get styles() {
        return [
            SharedStyles,
            css `
                :host {
                    display: block;
                }
                #mapid {
                width: 100%;
                height: 80vh;
                }
            `
        ];
    }
    render() {
        return html `
            <mwc-dialog id='emaildialog' heading="Login" @closed='${this.closeEmailDialog}'>
                <div>            
                    <div>
                        <mwc-textfield id='emailaddress' label='Email address'></mwc-textfield>
                    </div>
                    <div>
                        <mwc-textfield type='password' id='password' label="Password"></mwc-textfield>
                    </div>
                </div>
                <h3>Error code: ${this.errorCode}</h3>
                <h3>Error message: ${this.errorMessage}</h3>
                <mwc-button slot="primaryAction" dialogAction="login">Login</mwc-button>
                <mwc-button slot="secondaryAction" dialogAction="cancel">Cancel</mwc-button>
            </mwc-dialog>
            <mwc-dialog id='errordialog' heading="Login error" @closed='${this.closeErrorDialog}'>
                <div>            
                    <h3>Error code: ${this.errorCode}</h3>
                    <h3>Error message: ${this.errorMessage}</h3>
                    <h3>Error email: ${this.email}</h3>
                    <h3>Error credential: ${this.credential}</h3>
                </div>
                <mwc-button slot="primaryAction" dialogAction="close">Close</mwc-button>
            </mwc-dialog>
            <div>
                <mwc-button @click='${this.loginWithEmailAddress}'>Login with email</mwc-button>
                </div>
                <div>
                <mwc-button @click='${this.loginWithGoogle}'>Login with Google</mwc-button>
                </div>
                <div>
                <mwc-button @click='${this.logout}'>Logout</mwc-button>
                </div>
                <div>${this.displayName}</div>
                <div>${this.email}</div>
                <div>${this.photoURL}</div>
            </div>
      `;
    }
    firstUpdated(_changedProperties) {
    }
    loginWithEmailAddress(_el) {
        this.emaildialog.show();
    }
    loginWithGoogle(_el) {
        let provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
            'login_hint': 'user@example.com'
        });
        firebase.auth().signInWithPopup(provider).then((_result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // var token = result.credential.accessToken;
            // The signed-in user info.
            // ...
        }).catch((error) => {
            // Handle Errors here.
            this.errorCode = error.code;
            this.errorMessage = error.message;
            this.email = error.email;
            this.credential = error.credential;
            this.errordialog.show();
        });
    }
    closeErrorDialog(_el) {
        this.emaildialog.close();
    }
    closeEmailDialog(_el) {
        if (_el.detail !== null) {
            switch (_el.detail.action) {
                case 'login':
                    return this.loginWithEmail();
                default:
                    return this.emaildialog.close();
            }
        }
    }
    loginWithEmail() {
        const email = this.emailaddress.value.toString().trimStart().trimEnd();
        const password = this.password.value.toString().trimStart().trimEnd();
        firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
            // Handle Errors here.
            this.errorCode = error.code;
            this.errorMessage = error.message;
        });
        if (this.errorMessage === '') {
            this.emaildialog.close();
        }
    }
    stateChanged(_state) {
    }
    logout() {
        firebase.auth().signOut().then(() => {
            console.log("Logout OK");
            this.displayName = '';
            this.email = '';
            this.photoURL = '';
            const thisUser = {
                displayName: '',
                email: '',
                photoURL: '',
                uid: '',
                claims: {
                    admin: false,
                    reader: false,
                    member: false
                }
            };
            store.dispatch(userDataSelectUser(thisUser));
        }).catch(function (error) {
            console.log(error);
        });
    }
};
__decorate([
    query('#emaildialog')
], UserLogin.prototype, "emaildialog", void 0);
__decorate([
    query('#errordialog')
], UserLogin.prototype, "errordialog", void 0);
__decorate([
    query('#password')
], UserLogin.prototype, "password", void 0);
__decorate([
    query('#emailaddress')
], UserLogin.prototype, "emailaddress", void 0);
__decorate([
    property({ type: String })
], UserLogin.prototype, "displayName", void 0);
__decorate([
    property({ type: String })
], UserLogin.prototype, "email", void 0);
__decorate([
    property({ type: String })
], UserLogin.prototype, "photoURL", void 0);
__decorate([
    property({ type: String })
], UserLogin.prototype, "errorCode", void 0);
__decorate([
    property({ type: String })
], UserLogin.prototype, "errorMessage", void 0);
__decorate([
    property({ type: String })
], UserLogin.prototype, "credential", void 0);
UserLogin = __decorate([
    customElement('user-login')
], UserLogin);
export { UserLogin };

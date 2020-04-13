/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, customElement, css, property, query } from 'lit-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store, RootState } from '../store.js';

// These are the actions needed by this element.
import { firebase } from '@firebase/app';
import '@firebase/auth';
import '@material/mwc-dialog'
import '@material/mwc-textfield';
import '@material/mwc-button';

@customElement('user-login')
export class UserLogin extends connect(store)(PageViewElement) {
    @query('#emaildialog')
    private emaildialog: any;

    @query('#errordialog')
    private errordialog: any;

    @query('#password')
    private password: any;

    @query('#emailaddress')
    private emailaddress: any;

    @property({ type: String })
    private displayName: string | null = ''

    @property({ type: String })
    private email: string | null = ''

    @property({ type: String })
    private photoURL: string | null = ''

    @property({ type: String })
    private errorCode: string | null = ''

    @property({ type: String })
    private errorMessage: string | null = ''

    @property({ type: String })
    private credential: string | null = ''

    static get styles() {
        return [
            SharedStyles,
            css`
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

    protected render() {
        return html`
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

    protected firstUpdated(_changedProperties: any) {
    }

    private loginWithEmailAddress(_el: Event) {
        this.emaildialog.show();
    }

    private loginWithGoogle(_el: Event) {
        let provider = new firebase.auth!.GoogleAuthProvider();
        provider.setCustomParameters({
            'login_hint': 'user@example.com'
        });

        firebase.auth!().signInWithPopup(provider).then((_result) => {
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

    private closeErrorDialog(_el: any) {
        this.emaildialog.close();
    }

    private closeEmailDialog(_el: any) {
        if (_el.detail !== null) {
            switch (_el.detail.action) {
                case 'login':
                    return this.loginWithEmail();

                default:
                    return this.emaildialog.close();

            }
        }
    }

    private loginWithEmail() {
        const email = this.emailaddress.value.toString().trimStart().trimEnd();
        const password = this.password.value.toString().trimStart().trimEnd();
        firebase.auth!().signInWithEmailAndPassword(email, password).catch((error) => {
            // Handle Errors here.
            this.errorCode = error.code;
            this.errorMessage = error.message;
        });

        if (this.errorMessage === '') {
            this.emaildialog.close();
        }
    }

    stateChanged(_state: RootState) {
    }

    private logout() {
        firebase.auth!().signOut().then(() => {
            console.log("Logout OK");
            this.displayName = '';
            this.email = '';
            this.photoURL = '';
        }).catch(function (error) {
            console.log(error);
        })
    }
}

/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css, property, PropertyValues, customElement } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';
import { firebase } from '@firebase/app';
import '@firebase/database';
import '@firebase/auth';

// This element is connected to the Redux store.
import { store, RootState } from '../store.js';

import peakflowRecordMap, { peakflowRecordSelector } from '../reducers/peakflowrecords.js';

if (peakflowRecordSelector(store.getState()) === undefined) {
  store.addReducers({
    peakflowRecordMap,
  });
}

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState
} from '../actions/app.js';

// The following line imports the type only - it will be removed by tsc so
// another import for app-drawer.js is required below.
import { AppDrawerElement } from '@polymer/app-layout/app-drawer/app-drawer.js';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { menuIcon } from './my-icons.js';
import './snack-bar.js';
import { getPeakflowRecordData, peakflowDataLoaded } from '../actions/peakflowrecords.js';

const firebaseConfig = {
  apiKey: "AIzaSyBnHDWWIQD7Qmfe8nwz5hRjM7LSFnFXZJo",
  authDomain: "peak-flow-record.firebaseapp.com",
  databaseURL: "https://peak-flow-record.firebaseio.com",
  projectId: "peak-flow-record",
  storageBucket: "peak-flow-record.appspot.com",
  messagingSenderId: "349142976820",
  appId: "1:349142976820:web:86e116970ae1b1ce7e3d61",
  measurementId: "G-GZNC1B00TJ"
};

firebase.initializeApp!(firebaseConfig);
firebase.database!();

@customElement('my-app')
export class MyApp extends connect(store)(LitElement) {
  @property({ type: String })
  appTitle = '';

  @property({ type: String })
  private _page = '';

  @property({ type: String })
  private username: string | null = '';

  @property({ type: String })
  private userimage: string | null = '';

  @property({ type: Boolean })
  private _drawerOpened = false;

  @property({ type: Boolean })
  private _snackbarOpened = false;

  @property({ type: Boolean })
  private _offline = false;

  static get styles() {
    return [
      css`
        :host {
          display: block;

          --app-drawer-width: 256px;

          --app-primary-color: #e91e63;
          --app-secondary-color: #293237;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-section-even-color: #f7f7f7;
          --app-section-odd-color: white;

          --app-header-background-color: white;
          --app-header-text-color: var(--app-dark-text-color);
          --app-header-selected-color: var(--app-primary-color);

          --app-drawer-background-color: var(--app-secondary-color);
          --app-drawer-text-color: var(--app-light-text-color);
          --app-drawer-selected-color: #78909c;
        }

        app-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          background-color: var(--app-header-background-color);
          color: var(--app-header-text-color);
          border-bottom: 1px solid #eee;
        }

        .toolbar-top {
          background-color: var(--app-header-background-color);
        }

        [main-title] {
          font-size: 22px;
          /* In the narrow layout, the toolbar is offset by the width of the
          drawer button, and the text looks not centered. Add a padding to
          match that button */
          padding-right: 44px;
        }

        .toolbar-list {
          display: none;
        }

        .toolbar-list > a {
          display: inline-block;
          color: var(--app-header-text-color);
          text-decoration: none;
          line-height: 30px;
          padding: 4px 24px;
        }

        .toolbar-list > a[selected] {
          color: var(--app-header-selected-color);
          border-bottom: 4px solid var(--app-header-selected-color);
        }

        .menu-btn {
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        .drawer-list {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 24px;
          background: var(--app-drawer-background-color);
          position: relative;
        }

        .drawer-list > a {
          display: block;
          text-decoration: none;
          color: var(--app-drawer-text-color);
          line-height: 40px;
          padding: 0 24px;
        }

        .drawer-list > a[selected] {
          color: var(--app-drawer-selected-color);
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }

        .photo {
          position: fixed;
          top: 10px;
          right: 10px;
          border-radius: 50%;
          width: 55px;
          border: 15px;
        }

        .username {
          position: fixed;
          top: 65px;
          right: 10px;

        }

        .main-content {
          padding-top: 64px;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        footer {
          padding: 6px;
          background: var(--app-drawer-background-color);
          color: var(--app-drawer-text-color);
          text-align: center;
        }

        /* Wide layout: when the viewport width is bigger than 460px, layout
        changes to a wide layout */
        @media (min-width: 460px) {
          .toolbar-list {
            display: block;
          }

          .menu-btn {
            display: none;
          }

          .main-content {
            padding-top: 107px;
          }

          /* The drawer button isn't shown in the wide layout, so we don't
          need to offset the title */
          [main-title] {
            padding-right: 0px;
          }

        }
      `
    ];
  }

  protected render() {
    // Anything that's related to rendering should be done in here.
    return html`
      <!-- Header -->
      <app-header condenses reveals effects="waterfall">
        <app-toolbar class="toolbar-top">
          <button class="menu-btn" title="Menu" @click="${this._menuButtonClicked}">${menuIcon}</button>
          <div main-title>${this.appTitle}</div>
          <a href="/userlogin">
            <div class='username'>${this.username}</div>
            <img class='photo' src='${this.userimage}'>
          </a>
        </app-toolbar>

        <!-- This gets hidden on a small screen-->
        <nav class="toolbar-list">
          <a ?selected="${this._page === 'landingpage'}" href="/landingpage">Records</a>
          <a ?selected="${this._page === 'charts'}" href="/charts">Chart</a>
        </nav>
      </app-header>

      <!-- Drawer content -->
      <app-drawer
          .opened="${this._drawerOpened}"
          @opened-changed="${this._drawerOpenedChanged}">
        <nav class="drawer-list">
          <a ?selected="${this._page === 'landingpage'}" href="/landingpage">Records</a>
          <a ?selected="${this._page === 'charts'}" href="/charts">Chart</a>
        </nav>
      </app-drawer>

      <!-- Main content -->
      <main role="main" class="main-content">
        <landing-page class="page" ?active="${this._page === 'landingpage'}"></landing-page>
        <charts-view class="page" ?active="${this._page === 'charts'}"></charts-view>
          <user-login class="page" ?active="${this._page === 'userlogin'}" ></user-login>
        <my-view404 class="page" ?active="${this._page === 'view404'}"></my-view404>
      </main>

      <footer>
        <p>Made with &hearts; by the Geoff.</p>
      </footer>

      <snack-bar ?active="${this._snackbarOpened}">
        You are now ${this._offline ? 'offline' : 'online'}.
      </snack-bar>
    `;
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
  }

  protected firstUpdated() {
    installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname))));
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 460px)`, () => store.dispatch(updateDrawerState(false)));
    this.logUserIn()
  }



  private logUserIn() {
    firebase.auth!().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        firebase.auth!().currentUser!.getIdTokenResult()
          .then((_result) => {
            const user = firebase.auth!().currentUser;
            const uid = user!.uid
            this.username = user!.displayName
            this.userimage = user!.photoURL
            getPeakflowRecordData(uid);
            const newLocation = `/`
            window.history.pushState({}, '', newLocation);
            store.dispatch(navigate(decodeURIComponent(newLocation)));
          })
          .catch((error) => { console.log(error) })
        // ...
      } else {
        this.username = 'Login'
        this.userimage = ''
        store.dispatch(peakflowDataLoaded([]))
        const newLocation = `/userlogin`
        window.history.pushState({}, '', newLocation);
        store.dispatch(navigate(decodeURIComponent(newLocation)));
      }
    });
  }

  protected updated(changedProps: PropertyValues) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  private _menuButtonClicked() {
    store.dispatch(updateDrawerState(true));
  }

  private _drawerOpenedChanged(e: Event) {
    store.dispatch(updateDrawerState((e.target as AppDrawerElement).opened));
  }

  stateChanged(state: RootState) {
    this._page = state.app!.page;
    this._offline = state.app!.offline;
    this._snackbarOpened = state.app!.snackbarOpened;
    this._drawerOpened = state.app!.drawerOpened;
  }
}

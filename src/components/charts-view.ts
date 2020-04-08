/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, customElement, css, query, LitElement, property } from 'lit-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store, RootState } from '../store.js';

// These are the actions needed by this element.



@customElement('charts-view')
export class ChartsView extends connect(store)(LitElement) {
    @query('#mapid')
    private mapid: any;

    @property({ type: Boolean, reflect: true })
    private drawopened: boolean = false;

    static get styles() {
        return [
            SharedStyles,

            css`
                :host {
                    display: block;
                }
            `
        ];
    }

    protected render() {
        return html`
        <h1>Charts View</h1>
        <p>To be completed once we have more data to work with</p>
      `;
    }

    protected firstUpdated(_changedProperties: any) {
    }

    stateChanged(state: RootState) {
        if (this.drawopened !== state.app!.drawerOpened) {
            this.drawopened = state.app!.drawerOpened;
            if (this.drawopened) {
                this.mapid.setAttribute('foreground', '')
            } else {
                this.mapid.removeAttribute('foreground');
            }
        }
    }
}


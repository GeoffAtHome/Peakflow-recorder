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
import { html, customElement, css, query, LitElement, property } from 'lit-element';
// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
// This element is connected to the Redux store.
import { store } from '../store.js';
// These are the actions needed by this element.
let ChartsView = class ChartsView extends connect(store)(LitElement) {
    constructor() {
        super(...arguments);
        this.drawopened = false;
    }
    static get styles() {
        return [
            SharedStyles,
            css `
                :host {
                    display: block;
                }
            `
        ];
    }
    render() {
        return html `
        <h1>Charts View</h1>
        <p>To be completed once we have more data to work with</p>
      `;
    }
    firstUpdated(_changedProperties) {
    }
    stateChanged(state) {
        if (this.drawopened !== state.app.drawerOpened) {
            this.drawopened = state.app.drawerOpened;
            if (this.drawopened) {
                this.mapid.setAttribute('foreground', '');
            }
            else {
                this.mapid.removeAttribute('foreground');
            }
        }
    }
};
__decorate([
    query('#mapid')
], ChartsView.prototype, "mapid", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], ChartsView.prototype, "drawopened", void 0);
ChartsView = __decorate([
    customElement('charts-view')
], ChartsView);
export { ChartsView };

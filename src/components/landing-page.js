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
import { html, property, query, customElement, css } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
// These are the elements needed by this element.
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import '@material/mwc-dialog';
import '@material/mwc-textfield';
import '@material/mwc-button';
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';
import './my-time';
import './my-date';
import { labelIcon } from './my-icons.js';
// This element is connected to the Redux store.
import { store } from '../store.js';
// These are the actions needed by this element.
import { peakflowAddRecord } from '../actions/peakflowrecords.js';
// We are lazy loading its reducer.
import peakflowMap, { peakflowRecordSelector } from '../reducers/peakflowrecords.js';
if (peakflowRecordSelector(store.getState()) === undefined) {
    store.addReducers({
        peakflowMap
    });
}
// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';
let LandingPage = class LandingPage extends connect(store)(PageViewElement) {
    constructor() {
        super(...arguments);
        this.data = [];
        this.drawopened = false;
    }
    static get styles() {
        return [
            SharedStyles,
            css `
            :host {
                display: flex;
                align-items: flex-start;
                height: 100%;
            }

            #label {
                position: fixed;
                fill: white;
                bottom: 15px;
                right: 15px;
                z-index: 1;
            }

            vaadin-grid {
                width: 100%;
            }
          vaadin-grid-column {
            width: 200px;
            text-align: end;
            flex-grow: 1;
          }
        `
        ];
    }
    render() {
        return html `
            <mwc-dialog id='addDialog' heading="Add record" @closed='${this.closeAddDialog}'>
                <div>            
                    <div>
                        <mwc-textfield id='one' type='number' label='Reading one'></mwc-textfield>
                    </div>
                    <div>
                        <mwc-textfield id='two' type='number' label='Reading two'></mwc-textfield>
                    </div>
                    <div>
                        <mwc-textfield id='three' type='number' label='Reading three'></mwc-textfield>
                    </div>
                </div>
                <mwc-button slot="primaryAction" dialogAction="add">Add</mwc-button>
                <mwc-button slot="secondaryAction" dialogAction="cancel">Cancel</mwc-button>
            </mwc-dialog>
      <section>
        <p>Record and store peakflow reading</p>
      </section>
      <vaadin-grid id='grid' theme="row-dividers" column-reordering-allowed multi-sort aria-label="Addresses" .items="${this.data}" active-item="[[activeItem]]">
      <vaadin-grid-column width="100px" text-align="end">
        <template class="header">
          <vaadin-grid-sorter path="reading1">Reading 1</vaadin-grid-sorter>
        </template>
        <template>[[item.reading1]]</template>
      </vaadin-grid-column>      

      <vaadin-grid-column width="100px" text-align="end">
        <template class="header">
          <vaadin-grid-sorter path="reading2">Reading 2</vaadin-grid-sorter>
        </template>
        <template>[[item.reading2]]</template>
      </vaadin-grid-column>      

      <vaadin-grid-column width="100px" text-align="end">
        <template class="header" auto-width>
          <vaadin-grid-sorter path="reading3">Reading 3</vaadin-grid-sorter>
        </template>
        <template>[[item.reading3]]</template>
      </vaadin-grid-column>      

      <vaadin-grid-column width="100px" text-align="end">
        <template class="header">
          <vaadin-grid-sorter path="aveage">Average</vaadin-grid-sorter>
        </template>
        <template>[[item.average]]</template>
      </vaadin-grid-column>      

      <vaadin-grid-column width="100px" text-align="end">
        <template class="header">
          <vaadin-grid-sorter path="timestamp">Time</vaadin-grid-sorter>
        </template>
        <template><my-time time='[[item.timestamp]]'></my-time></template>
      </vaadin-grid-column>      

      <vaadin-grid-column width="100px" text-align="end">
        <template class="header">
          <vaadin-grid-sorter path="timestamp">Date</vaadin-grid-sorter>
        </template>
        <template><my-date date='[[item.timestamp]]'></my-date></template>
      </vaadin-grid-column>      
      </vaadin-grid>
      <mwc-button id="label" raised @click="${this.addRecordDialog}">${labelIcon}</mwc-button>
   `;
    }
    addRecordDialog(_el) {
        this.addDialog.show();
    }
    addRecord() {
        let record = {
            reading1: this.readingOne.value,
            reading2: this.readingTwo.value,
            reading3: this.readingThree.value,
            timestamp: new Date().getTime()
        };
        store.dispatch(peakflowAddRecord(record));
        return this.addDialog.close();
    }
    closeAddDialog(_el) {
        if (_el.detail !== null) {
            switch (_el.detail.action) {
                case 'add':
                    return this.addRecord();
                default:
                    return this.addDialog.close();
            }
        }
    }
    stateChanged(state) {
        if (this.drawopened !== state.app.drawerOpened) {
            this.drawopened = state.app.drawerOpened;
            if (this.drawopened) {
                this.grid.setAttribute('drawopened', '');
            }
            else {
                this.grid.removeAttribute('drawopened');
            }
        }
        const peakflowRecordState = peakflowRecordSelector(state);
        this.data = peakflowRecordState.data;
    }
};
__decorate([
    property({ type: Array })
], LandingPage.prototype, "data", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], LandingPage.prototype, "drawopened", void 0);
__decorate([
    query('#grid')
], LandingPage.prototype, "grid", void 0);
__decorate([
    query('#addDialog')
], LandingPage.prototype, "addDialog", void 0);
__decorate([
    query('#one')
], LandingPage.prototype, "readingOne", void 0);
__decorate([
    query('#two')
], LandingPage.prototype, "readingTwo", void 0);
__decorate([
    query('#three')
], LandingPage.prototype, "readingThree", void 0);
LandingPage = __decorate([
    customElement('landing-page')
], LandingPage);
export { LandingPage };

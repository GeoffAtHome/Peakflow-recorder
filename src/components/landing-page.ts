/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, property, query, customElement, css } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

// These are the elements needed by this element.
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import '@material/mwc-dialog'
import '@material/mwc-textfield';
import '@material/mwc-button';
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';
import './my-time'
import './my-date'

import { labelIcon } from './my-icons.js';


// This element is connected to the Redux store.
import { store, RootState } from '../store.js';

// These are the actions needed by this element.
import { PeakflowRecord, peakflowAddRecord, PeakflowFirebaseRecord } from '../actions/peakflowrecords.js';

// We are lazy loading its reducer.
import peakflowMap, { peakflowRecordSelector } from '../reducers/peakflowrecords.js';

if (peakflowRecordSelector(store.getState()) === undefined) {
  store.addReducers({
    peakflowMap
  });
}


// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

@customElement('landing-page')
export class LandingPage extends connect(store)(PageViewElement) {
  @property({ type: Array })
  private data: Array<PeakflowRecord> = [];

  @property({ type: Boolean, reflect: true })
  private drawopened: boolean = false;

  @query('#grid')
  private grid: any;

  @query('#addDialog')
  private addDialog: any;

  @query('#one')
  private readingOne: any;

  @query('#two')
  private readingTwo: any;

  @query('#three')
  private readingThree: any;

  static get styles() {
    return [
      SharedStyles,
      css`
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

  protected render() {
    return html`
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


  private addRecordDialog(_el: Event) {
    this.addDialog.show();
  }

  private addRecord() {
    let record: PeakflowFirebaseRecord = {
      reading1: this.readingOne.value,
      reading2: this.readingTwo.value,
      reading3: this.readingThree.value,
      timestamp: new Date().getTime()
    }

    store.dispatch(peakflowAddRecord(record));

    return this.addDialog.close();
  }

  private closeAddDialog(_el: any) {
    if (_el.detail !== null) {
      switch (_el.detail.action) {
        case 'add':
          return this.addRecord();

        default:
          return this.addDialog.close();

      }
    }
  }


  stateChanged(state: RootState) {
    if (this.drawopened !== state.app!.drawerOpened) {
      this.drawopened = state.app!.drawerOpened;
      if (this.drawopened) {
        this.grid.setAttribute('drawopened', '')
      } else {
        this.grid.removeAttribute('drawopened');
      }
    }
    const peakflowRecordState = peakflowRecordSelector(state);
    this.data = peakflowRecordState!.data
  }
}

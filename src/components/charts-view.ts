/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, customElement, css, LitElement, property } from 'lit-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@google-web-components/google-chart'

// This element is connected to the Redux store.
import { store, RootState } from '../store.js';

// We are lazy loading its reducer.
import peakflowMap, { peakflowRecordSelector } from '../reducers/peakflowrecords.js';

if (peakflowRecordSelector(store.getState()) === undefined) {
    store.addReducers({
        peakflowMap
    });
}




@customElement('charts-view')
export class ChartsView extends connect(store)(LitElement) {
    @property({ type: Array })
    private data: Array<[Date, number, number, number]> = [];

    @property({ type: Object })
    private options: {} = {
        title: 'Peakflow',
        curveType: 'function',
        legend: 'right',
        hAxis: {
            title: 'Date'
        },
        vAxis: {
            title: 'flow (1-1000)'
        },
    }

    @property({ type: Array })
    private cols: Array<{}> = [{ "label": "Date", "type": "datetime" }, { "label": "Peak", "type": "number" }, { "label": "Average", "type": "number" }, { "label": "Min", "type": "number" }]

    static get styles() {
        return [
            SharedStyles,
            css`
            :host {
                display: block;
            }
            google-chart {
                width: 100vw
            }
        `
        ];
    }

    protected render() {
        return html`
        <h1>Charts View</h1>
        <google-chart .options='${this.options}' type='line' .cols='${this.cols}' .rows='${this.data}'></google-chart>
      `;
    }

    protected firstUpdated(_changedProperties: any) {
    }

    stateChanged(state: RootState) {
        const peakflowRecordState = peakflowRecordSelector(state);
        const rawData = peakflowRecordState!.data
        this.data = []
        for (const item of rawData) {
            this.data.push([new Date(item.timestamp), Math.max(item.reading1, item.reading2, item.reading3), (item.reading1 + item.reading2 + item.reading3) / 3, Math.min(item.reading1, item.reading2, item.reading3)])
        }
        // this.chart.draw(this.data, options)
    }
}
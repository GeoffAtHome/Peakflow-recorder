/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import { firebase } from '@firebase/app';
import '@firebase/database';
import { store } from '../store';
export const PEAKFLOWRECORD_ID = 'PEAKFLOWRECORD_ID';
export const PEAKFLOW_DATA_LOADED = 'PEAKFLOW_DATA_LOADED';
export const PEAKFLOW_ADD_RECORD = 'PEAKFLOW_ADD_RECORD';
let peakflowRecordData;
export let peakflowRecordUserUID = '';
;
;
;
export const peakflowRecordState = (_index) => {
    return ({
        type: PEAKFLOWRECORD_ID,
        _index
    });
};
export const peakflowDataLoaded = (_data) => {
    return ({
        type: PEAKFLOW_DATA_LOADED,
        _data
    });
};
export const peakflowAddRecord = (_record) => {
    return ({
        type: PEAKFLOW_ADD_RECORD,
        _record
    });
};
const firebaseRefPeakflowRecordRoot = '/records/';
export let firebaseRefPeakflowRecord = '/records/';
export async function getPeakflowRecordData(uid) {
    peakflowRecordUserUID = uid;
    firebaseRefPeakflowRecord = firebaseRefPeakflowRecordRoot + uid;
    const dataref = firebase.database().ref(firebaseRefPeakflowRecord);
    dataref.on('value', function (data) {
        transformPeakflowData(data.val());
        setTimeout(() => { store.dispatch(peakflowDataLoaded(peakflowRecordData)); }, 1);
    });
}
function transformPeakflowData(dataObject) {
    peakflowRecordData = [];
    if (dataObject !== null) {
        for (const key of Object.entries(dataObject)) {
            const record = key[1];
            const item = {
                reading1: Number(record.reading1),
                reading2: Number(record.reading2),
                reading3: Number(record.reading3),
                average: ((Number(record.reading1) + Number(record.reading2) + Number(record.reading3)) / 3).toFixed(1),
                timestamp: Number(record.timestamp),
                index: key[0]
            };
            peakflowRecordData.push(item);
        }
    }
    return peakflowRecordData;
}
export function lookupPeakflowRecord(key) {
    const result = peakflowRecordData.filter((x) => { return x.index === key; });
    if (result.length !== 1) {
        console.error('Error in peakflow');
    }
    return result[0];
}

/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { Reducer } from 'redux';
import { PeakflowRecordState, PEAKFLOWRECORD_ID, PEAKFLOW_DATA_LOADED, PEAKFLOW_ADD_RECORD, firebaseRefPeakflowRecord, PeakflowFirebaseRecord, getPeakflowRecordData, peakflowRecordUserUID } from '../actions/peakflowrecords.js';
import { RootAction, RootState } from '../store.js';
import { firebase } from '@firebase/app';
import '@firebase/database';

const INITIAL_STATE: PeakflowRecordState = {
    index: '',
    data: []
};

const peakflowRecordMap: Reducer<PeakflowRecordState, RootAction> = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PEAKFLOWRECORD_ID:
            return {
                ...state,
                _index: action._index
            };

        case PEAKFLOW_DATA_LOADED:
            return {
                ...state,
                data: action._data
            }

        case PEAKFLOW_ADD_RECORD:
            addRecordToFirebase(action._record)
            return {
                ...state
            }

        default:
            return state;
    }
};


export default peakflowRecordMap;

// Per Redux best practices, the shop data in our store is structured
// for efficiency (small size and fast updates).
//
// The _selectors_ below transform store data into specific forms that
// are tailored for presentation. Putting this logic here keeps the
// layers of our app loosely coupled and easier to maintain, since
// views don't need to know about the store's internal data structures.
//
// We use a tiny library called `reselect` to create efficient
// selectors. More info: https://github.com/reduxjs/reselect.

export const peakflowRecordSelector = (state: RootState) => state.peakflowRecordMap;

async function addRecordToFirebase(record: PeakflowFirebaseRecord) {
    const dataref = firebase.database!().ref(firebaseRefPeakflowRecord);
    const newRef = dataref.push();
    const snapshot = await newRef.set(record);
    await getPeakflowRecordData(peakflowRecordUserUID)
    return snapshot;
}

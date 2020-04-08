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
import { USER_ID, UsersItem, UsersState, USER_DATA_LOADED, ADD_USER, UPDATE_USER, DELETE_USER, SELECT_USER } from '../actions/users.js';
import { RootAction, RootState } from '../store.js';
import { firebase } from '@firebase/app';
import '@firebase/database';

const INITIAL_STATE: UsersState = {
    _newUser: {
        displayName: '',
        email: '',
        photoURL: '',
        uid: '',
        claims: {
            admin: false,
            reader: false,
            member: false
        }
    },
    _index: '',
    _userData: []
};

const userdata: Reducer<UsersState, RootAction> = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_ID:
            return {
                ...state,
            };


        case USER_DATA_LOADED:
            let userData: Array<UsersItem> = [];
            let dataObject: object = action._data;

            if (dataObject !== null) {
                for (const key of Object.entries(dataObject)) {
                    let item = key[1];
                    item.uid = key;
                    userData.push(item);
                }
            }
            return {
                ...state,
                _userData: userData
            }

        case ADD_USER:
            addToFirebase(action._newUser);
            return {
                ...state
            }

        case UPDATE_USER:
            updateFirebase(action._newUser);
            return {
                ...state
            }

        case DELETE_USER:
            removeFirebase(action._newUser);
            return {
                ...state
            }

        case SELECT_USER:
            return {
                ...state,
                _newUser: action._newUser

            }

        default:
            return state;
    }
};


const firebaseRef = '/Users/';

async function addToFirebase(newUser: UsersItem) {
    const dataref = firebase.database!().ref(firebaseRef);
    const newRef = await dataref.push();
    const snapshot = await newRef.set(newUser);
    return snapshot;
}


async function updateFirebase(newUser: UsersItem) {
    const dataref = firebase.database!().ref(firebaseRef + newUser.uid);
    const snapshot = await dataref.update(newUser);

    return snapshot;
}

async function removeFirebase(newUser: UsersItem) {
    const dataref = firebase.database!().ref(firebaseRef + newUser.uid);
    const snapshot = await dataref.remove();
    return snapshot;
}


export default userdata;

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

export const userdataSelector = (state: RootState) => state.userdata;

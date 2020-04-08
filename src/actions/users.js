/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
export const USER_ID = 'USER_ID';
export const USER_DATA_LOADED = 'USER_DATA_LOADED';
export const ADD_USER = "ADD_USER";
export const UPDATE_USER = "UPDATE_USER";
export const DELETE_USER = "DELETE_USER";
export const SELECT_USER = "SELECT_USER";
;
;
;
;
;
;
export const userDataState = (_newUser, _index) => {
    return ({
        type: USER_ID,
        _newUser,
        _index
    });
};
export const userDataLoaded = (_data) => {
    return ({
        type: USER_DATA_LOADED,
        _data
    });
};
export const userDataAddUser = (_newUser) => {
    return ({
        type: ADD_USER,
        _newUser
    });
};
export const userDataDeleteUser = (_newUser) => {
    return ({
        type: DELETE_USER,
        _newUser
    });
};
export const userDataUpdateUser = (_newUser) => {
    return ({
        type: UPDATE_USER,
        _newUser
    });
};
export const userDataSelectUser = (_newUser) => {
    return ({
        type: SELECT_USER,
        _newUser
    });
};

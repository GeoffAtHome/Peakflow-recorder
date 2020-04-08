/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, customElement, LitElement, property } from 'lit-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

@customElement('my-date')
export class MyDate extends LitElement {
    @property({ type: String })
    private date: string = '';

    static get styles() {
        return [
            SharedStyles
        ];
    }

    protected render() {
        const text = new Date(Number(this.date)).toLocaleDateString()
        return html`${text}`;
    }
}

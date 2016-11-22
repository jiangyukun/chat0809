/**
 * Created by jiangyukun on 2016/11/22.
 */
import React, {Component} from 'react'
import {merge} from 'lodash'
import ListComponent from './ListComponent'

export default class SimpleListComponent extends ListComponent {
    constructor(props) {
        super(props)
        this.state = this.getState()
    }
}

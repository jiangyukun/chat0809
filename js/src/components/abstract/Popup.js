/**
 * Created by jiangyukun on 2016/11/17.
 */
import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import {events} from 'dom-helpers'

class Popup extends Component {
    constructor(props) {
        super(props)
        this.handleContainerClick = this.handleContainerClick.bind(this)
        this.handleDocumentClick = this.handleDocumentClick.bind(this)
    }

    doHandleDocumentClick() {
    }

    handleContainerClick() {
        this.keep = true
    }

    handleDocumentClick() {
        if (this.keep) {
            this.keep = false
            return
        }
        this.doHandleDocumentClick()
    }

    componentDidMount() {
        events.on(findDOMNode(this), 'click', this.handleContainerClick)
        events.on(document, 'click', this.handleDocumentClick)
    }

    componentWillUnmount() {
        events.off(findDOMNode(this), 'click', this.handleContainerClick)
        events.off(document, 'click', this.handleDocumentClick)
    }
}

export default Popup

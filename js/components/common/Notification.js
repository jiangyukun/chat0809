/**
 * jiangyukun on 2016/8/5 09:51
 */
import React, {Component, addons} from 'react'
import classnames from 'classnames'
import {NotificationType} from '../../constants/ChatConstants'
import notificationActions from '../../actions/NotificationActions'

export default class Notification extends Component {
    constructor(props) {
        super(props)
        this.state = {closing: false}
    }

    getClassName() {
        let type = this.props.info.type
        return classnames("notification-item", {
            'success': type == NotificationType.SUCCESS,
            'error': type == NotificationType.ERROR,
            'closing': this.state.closing
        })
    }

    close() {
        this.setState({closing: true})
        setTimeout(()=>notificationActions.removeNotification(this.props.info.id), 500)
    }

    componentWillMount() {
        setTimeout(() => this.close(), 3000)
    }

    render() {
        let {title, content} = this.props.info
        return (
            <div className={this.getClassName()}>
                <i className="close" onClick={e=>this.close()}>&times;</i>
                <div className="title">{title}</div>
                <div>{content}</div>
            </div>
        )
    }
}

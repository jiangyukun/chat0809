/**
 * jiangyukun on 2016/8/5 10:03
 */
import React, {Component} from 'react'

import Notification from './Notification'
import NotificationStore from '../../stores/NotificationStore'


function getNotificationList() {
    return {
        notificationList: NotificationStore.getNotificationList()
    }
}

export default class NotificationContainer extends Component {
    constructor(props) {
        super(props)
        this.state = getNotificationList()
    }

    componentWillMount() {
        NotificationStore.addChangeListener(()=> {
            this.setState(getNotificationList())
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.notificationList.map(notification=> {
                        return <Notification key={notification.id} info={notification}/>
                    })
                }
            </div>
        )
    }
}

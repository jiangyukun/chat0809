/**
 * Created by jiangyukun on 2016/10/26.
 */
import React, {Component} from 'react'
import {Collapse} from 'react-bootstrap'
import classnames from 'classnames'
import MessageHelper from '../core/MessageHelper'
import {ChatType} from '../../constants/ChatConstants'
import {loadMore} from '../../constants/constants'

class GroupList extends Component {
    constructor() {
        super()
        this.state = {
            active: true,
            maxCount: loadMore.init
        }
    }

    loadMore() {
        this.setState({maxCount: this.state.maxCount + loadMore.increase})
    }

    render() {
        let rooms = this.props.rooms
        let roomMessage = this.props.roomMessage

        let unread = 0
        rooms.map((room) => {
            let msg = roomMessage.find(msg=>msg.id == room.id)
            unread += msg ? msg.unreads.length : 0
        })

        var unreadMessage = (roomId)=> {
            let msg = roomMessage.find(msg=>msg.id == roomId)
            let count = msg ? msg.unreads.length : 0
            return count > 0 ? <span className="red">({count})</span> : ''
        }

        let currentCount = 0, filterCount = 0

        return (
            <div>
                <header className="list-head" onClick={e=> this.setState({active: !this.state.active})}>
                    <span>患者群组{unread > 0 && <span className="red">({unread})</span>}</span>
                </header>
                <Collapse in={this.state.active}>
                    <ul>
                        {
                            rooms.map((room) => {

                                let key = this.props.searchKey
                                if (key) {
                                    if (!room.name || room.name.indexOf(key) == -1) {
                                        return null
                                    }
                                }

                                filterCount++
                                if (currentCount >= this.state.maxCount) {
                                    return null
                                }
                                currentCount++
                                return (
                                    <li key={room.id}
                                        className={classnames("list-item", {'active': room.id == this.props.selectedId})}
                                        onClick={e=> this.props.startChat(room)}
                                    >
                                        {room.name || room.id}
                                        {unreadMessage(room.id)}
                                    </li>
                                )
                            })
                        }
                        {
                            currentCount < filterCount && (
                                <li className="load-more" onClick={e=>this.loadMore()}>加载更多</li>
                            )
                        }
                    </ul>
                </Collapse>
                {
                    filterCount == 0 && (
                        <div className="no-data">暂无数据</div>
                    )
                }
            </div>
        )
    }
}

export default GroupList

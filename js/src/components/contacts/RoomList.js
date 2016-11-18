/**
 * Created by jiangyukun on 2016/11/10.
 */
import React, {Component} from 'react'
import classnames from 'classnames'

import {loadMore} from '../../constants/constants'
import {ChatType} from '../../constants/ChatConstants'

class RoomList extends Component {
    constructor() {
        super()
        this.state = {maxCount: loadMore.init}
    }

    loadMore() {
        this.setState({maxCount: this.state.maxCount + loadMore.increase})
    }

    render() {
        let currentCount = 0, filterCount = 0

        return (
            <div>
                {
                    this.props.rooms.length > 0 && (
                        <div>
                            <h4 className="contact_title">群组</h4>
                        </div>
                    )
                }
                {
                    this.props.rooms.map(room => {
                        filterCount++
                        if (currentCount >= this.state.maxCount) {
                            return null
                        }
                        currentCount++

                        return (
                            <div key={room.id}
                                 className={classnames('', {'active': room.id == this.props.selectedContactId})}
                                 onDoubleClick={e => this.props.startChat(room, ChatType.GROUP_CHAT)}>
                                <div className="contact_item"
                                     onClick={e => this.props.lookRoomDetail(room.id)}>
                                    <div className="avatar">
                                        <img className="img" src="img/default.jpg"/>
                                    </div>
                                    <div className="info">
                                        <h4 className="nickname">{room.nickname || room.name || room.id}</h4>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    currentCount < filterCount && (
                        <a href="javascript:" className="load-more" onClick={e => this.loadMore()}>加载更多</a>
                    )
                }
            </div>
        )
    }
}

export default RoomList

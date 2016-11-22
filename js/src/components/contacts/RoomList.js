/**
 * Created by jiangyukun on 2016/11/10.
 */
import React, {Component} from 'react'
import classnames from 'classnames'

import SimpleListComponent from '../abstract/SimpleListComponent'
import {ChatType} from '../../constants/ChatConstants'

class RoomList extends SimpleListComponent {
    render() {
        this.initRender()

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
                        if (!this.isContinueLoad()) {
                            return null
                        }

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
                    this.haveMoreListItem() && (
                        <a href="javascript:" className="load-more" onClick={e => this.loadMore()}>加载更多</a>
                    )
                }
            </div>
        )
    }
}

export default RoomList

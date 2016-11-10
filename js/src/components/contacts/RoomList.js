/**
 * Created by jiangyukun on 2016/11/10.
 */
import React, {Component} from 'react'
import classnames from 'classnames'

class RoomList extends Component {

    render() {
        return (
            <div>
                <div>
                    <h4 className="contact_title">群组</h4>
                </div>
                {
                    this.props.rooms.map(room=> {
                        return (
                            <div key={room.id}
                                 className={classnames('', {'active': room.id == this.props.selectedId})}
                                 onDoubleClick={e=>this.props.startChat(room.id)}>
                                <div className="contact_item"
                                     onClick={e=>this.props.lookRoomDetail(room.id)}>
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
            </div>
        )
    }
}

export default RoomList

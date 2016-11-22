/**
 * Created by jiangyukun on 2016/11/10.
 */
import React, {Component} from 'react'
import classnames from 'classnames'

import SimpleListComponent from '../abstract/SimpleListComponent'
import {ChatType} from '../../constants/ChatConstants'

class DoctorList extends SimpleListComponent {
    render() {
        this.initRender()

        return (
            <div>
                {
                    this.props.doctors.length > 0 && (
                        <div>
                            <h4 className="contact_title">医生</h4>
                        </div>
                    )
                }
                {
                    this.props.doctors.map(doctor => {
                        if (!this.isContinueLoad()) {
                            return null
                        }

                        return (
                            <div key={doctor.name}
                                 className={classnames('', {'active': doctor.name == this.props.selectedContactId})}
                                 onDoubleClick={e => this.props.startChat(doctor, ChatType.CHAT)}>
                                <div className="contact_item"
                                     onClick={e => this.props.lookUserDetail(doctor.name)}>
                                    <div className="avatar">
                                        <img className="img" src="img/default.jpg"/>
                                    </div>
                                    <div className="info">
                                        <h4 className="nickname">{doctor.nickname || doctor.name}</h4>
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

export default DoctorList

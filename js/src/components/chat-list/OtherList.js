/**
 * Created by jiangyukun on 2016/10/26.
 */
import React, {Component} from 'react'
import {Collapse} from 'react-bootstrap'
import classnames from 'classnames'
import MessageHelper from '../core/MessageHelper'
import {ChatType} from '../../constants/ChatConstants'
import {loadMore} from '../../constants/constants'

class OtherList extends Component {
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
        let others = this.props.others
        let singleMessage = this.props.singleMessage

        let unread = 0
        others.forEach((other) => {
            let msg = singleMessage.find(msg=>msg.name == other.name)
            unread += msg ? msg.unreads.length : 0
        })

        var unreadMessage = name=> {
            let msg = singleMessage.find(single=>single.name == name)
            let count = msg ? msg.unreads.length : 0
            return count > 0 ? <span className="red">({count})</span> : ''
        }

        let currentCount = 0, filterCount = 0

        return (
            <div>
                <header className="list-head" onClick={e=> this.setState({active: !this.state.active})}>
                    <span>未分组{unread > 0 && <span className="red">({unread})</span>}</span>
                </header>
                <Collapse in={this.state.active}>
                    <ul>
                        {
                            others.map((other, index) => {
                                let key = this.props.searchKey
                                let idInfo = ' '
                                if (key) {
                                    if (other.name != other.nickname) {
                                        idInfo = '(' + other.name + ')'
                                    }
                                    if ((!other.nickname || other.nickname.indexOf(key) == -1) && (!other.name || other.name.indexOf(key) == -1)) {
                                        return null
                                    }
                                }

                                filterCount++
                                if (currentCount >= this.state.maxCount) {
                                    return null
                                }
                                currentCount++
                                return (
                                    <li key={index} className={classnames("list-item", {'active': other.name == this.props.selectedId})}
                                        onClick={e=> this.props.startChat(other)}>
                                        {
                                            other.name ? other.name + idInfo : other.id
                                        }
                                        {
                                            unreadMessage(other.name)
                                        }
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

export default OtherList

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
        let message = this.props.message
        let otherList = MessageHelper.getUnMarkMessage(message)

        var unreadMessage = (name, type)=> {
            let count = MessageHelper.getUnreadCount(message, name, type)
            return count > 0 ? <span className="red">({count})</span> : ''
        }

        let currentCount = 0, filterCount = 0

        return (
            <div>
                <header className="list-head" onClick={e=> this.setState({active: !this.state.active})}>
                    <span>其他</span>
                </header>
                <Collapse in={this.state.active}>
                    <ul>
                        {
                            otherList.map((other, index) => {
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
                                    <li key={index} className={classnames("list-item", {'active': other.active})}
                                        onClick={e=> this.props.startChat(other)}>
                                        {other.nickname ? other.nickname + idInfo : other.name}
                                        {unreadMessage(other.name, ChatType.CHAT)}
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

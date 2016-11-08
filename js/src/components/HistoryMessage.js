/*
 * jiangyukun on 2016-07-29 19:25
 */
import React, {Component, PropTypes} from 'react'

import Message from './Message'

export default class HistoryMessage extends Component {
    static contextTypes = {
        curUserId: PropTypes.string
    }

    constructor(props) {
        super(props)
    }

    render() {
        let historyMessageList = this.props.historyMessage

        return (
            <div className="history-message-container h100-pct">
                <div className="panel">
                    <div className="panel-heading head">聊天记录</div>
                    <div className="panel-body">
                        {
                            historyMessageList.length == 0 && (
                                <div className="text-center">暂无数据</div>
                            )
                        }
                        {
                            historyMessageList.length > 0 && historyMessageList.map((historyItem, index)=> {
                                return <Message key={historyItem.id}
                                                msg={historyItem}
                                                dir={this.context.curUserId == historyItem.from ? 'right' : 'left'}/>
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

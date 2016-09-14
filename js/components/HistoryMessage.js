/*
 * jiangyukun on 2016-07-29 19:25
 */
import React, {Component} from 'react'

import Message from './Message'

export default class HistoryMessage extends Component {
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
                            historyMessageList.map((historyItem, index)=> {
                                return <Message key={index} msg={historyItem}
                                                dir={this.context.curUserId == historyItem.from ? 'right' : 'left'}/>
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

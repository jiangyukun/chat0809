/**
 * Created by jiangyukun on 2016/11/9.
 */
import React, {Component, PropTypes} from 'react'
import classnames from 'classnames'

import {APP_SOUND} from '../constants/ChatConstants'

class SystemMenu extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className={classnames('mmpop', 'system_menu')} tabIndex="-1" style={{top: '60px', left: '85px'}}>
                <ul className="dropdown_menu">
                    <li>
                        {
                            this.props.appSoundState == APP_SOUND.ON ? (
                                <a tabIndex="-1" href="javascript:;" onClick={e=>this.props.closeSound()} title="关闭声音">
                                    <i className="menuicon_volume_on"></i>关闭声音
                                </a>
                            ) : (
                                <a tabIndex="-1" href="javascript:;" onClick={e=>this.props.openSound()} title="打开声音">
                                    <i className="menuicon_volume_mute"></i>打开声音
                                </a>
                            )
                        }

                    </li>
                    <li className="last_child" href="javascript:;" title="退出">
                        <a tabIndex="-1" onClick={this.props.exit}>
                            <i className="menuicon_quit"></i>
                            退出
                        </a>
                    </li>
                </ul>
            </div>
        )
    }
}

SystemMenu.propTypes = {
    appSoundState: PropTypes.oneOf([APP_SOUND.ON, APP_SOUND.OFF]),
    closeSound: PropTypes.func,
    openSound: PropTypes.func,
    exit: PropTypes.func
}

export default SystemMenu

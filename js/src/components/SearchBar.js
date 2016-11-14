/**
 * Created by jiangyukun on 2016/11/9.
 */
import React, {Component} from 'react'

class SearchBar extends Component {

    render() {
        return (
            <div className="search_bar">
                <i className="web_wechat_search"></i>

                <input className="frm_search" type="text"
                       onInput={e=>this.search(e)} onKeyDown={e=>this.searchKeydown(e)} placeholder="搜索"/>

                <div className="mmpop recommendation" tabIndex="-1">
                    <div className="scroll-wrapper contacts scrollbar-dynamic" style={{position: 'relative'}}>
                        <div className="contacts scrollbar-dynamic scroll-content scroll-scrolly_visible">
                            <div>
                                {

                                }
                                {/*<div>
                                    <h4 className="contact_title first">好友</h4>
                                </div>
                                <div>
                                    <div className="contact_item on">
                                        <div className="avatar">
                                            <img className="img lazy" src="img/default.jpg"/>
                                        </div>
                                        <div className="info">
                                            <h4 className="nickname ">哈哈哈</h4>
                                        </div>
                                    </div>
                                </div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchBar

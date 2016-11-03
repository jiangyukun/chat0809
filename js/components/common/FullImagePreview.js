/**
 * Created by jiangyukun on 2016/8/8.
 */
import React, {Component} from 'react'
import ImagePreviewStore from '../../stores/ImagePreviewStore'
import ImagePreviewActions from '../../actions/ImagePreviewActions'

function getState() {
    return {
        flag: ImagePreviewStore.getShowOrHide(),
        url: ImagePreviewStore.getUrl()
    }
}

export default class FullImagePreview extends Component {
    constructor(props) {
        super(props)
        this.state = getState()
    }

    componentWillMount() {
        ImagePreviewStore.addChangeListener(()=> {
            this.setState(getState())
        })
    }

    close() {
        ImagePreviewActions.hide()
    }

    render() {
        return this.state.flag ? (
            <div className="image-preview-container">
                <div className="mask" onClick={e=>this.close()}></div>
                <div className="close" onClick={e=>this.close()}>&times;</div>
                <div className="image-container">
                    <img className="img-responsive" src={this.state.url}/>
                </div>
            </div>
        ) : null
    }
}

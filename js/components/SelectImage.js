/*
 * jiangyukun on 2016-07-30 18:10
 */
import React, {Component} from 'react'
import {Modal, Button} from 'react-bootstrap'

export default class SelectImage extends Component {
    constructor(props) {
        super(props)
        this.state = {imagePreview: false}
    }

    onChange(e) {
        let file = e.target.files[0]
        if (!file) return

        this.setState({file})
        let fileReader = new FileReader()

        fileReader.readAsDataURL(file)
        fileReader.onload = (e)=> {
            this.props.imageSelected()
            this.setState({imagePreview: true, url: e.target.result})
        }
    }

    showImagePreview() {
        if (this.state.imagePreview) {
            return (
                <div className="image-preview-container">
                    <img className="img-responsive" src={this.state.url}/>
                </div>
            )
        }
        return null
    }

    getImageFile() {
        return this.state.file
    }

    render() {
        return (
            <div className="select-image">
                <div className="select-image-container">
                    <button className="btn select-image-btn">选择图片</button>
                    <input type="file" className="select-image-input" onChange={(e)=>{this.onChange(e)}}/>
                </div>
                {this.showImagePreview()}
            </div>
        )
    }
}


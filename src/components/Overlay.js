import React from 'react';
//import Websocket from 'react-websocket';

class Overlay extends React.Component {

    render() {
        return (
            <div className={this.props.overlayState}>
                <div className="overlay-text">{this.props.overlayText}</div>
            </div>
        );
    }

}

export default Overlay;
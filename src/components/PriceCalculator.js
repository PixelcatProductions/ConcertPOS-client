import React from 'react';
//import Websocket from 'react-websocket';

class PriceCalculator extends React.Component {
    // this.props.workplaceid


    constructor(props) {
        super(props);

        this.state = {
            fullscreen: false
        }
        this.fullscreen = this.fullscreen.bind(this);
    }

    refreshAll() {
        this.props.refreshProducts();
        this.props.refreshPM();
        this.props.resetProducts();
    }


    fullscreen() {
        var elem = document.documentElement;

        if (document.fullscreenEnabled) {

            if (document.fullscreenElement === null) {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.mozRequestFullScreen) { /* Firefox */
                    elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { /* IE/Edge */
                    elem.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { /* Firefox */
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE/Edge */
                    document.msExitFullscreen();
                }
            }
        }


    }

    render() {

        let RefreshButtonColor = `btn ${this.props.RefreshButtonColor}`;

        return (
            <div>
                <hr />
                <div className="text-center">
                    <h2><button onClick={this.fullscreen} className="btn btn-warning">Fullscreen</button> <button onClick={this.props.leavePOS} className="btn btn-danger">Verlassen</button> {this.props.TotalPrice}€ (inklusive Pfand) <button onClick={this.refreshAll.bind(this)} className={RefreshButtonColor}>{this.props.RefreshButtonText}</button></h2>
                </div >
                <hr />
            </div>
        );
    }

}

export default PriceCalculator;
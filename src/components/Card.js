import React from 'react';
//import Websocket from 'react-websocket';

class Card extends React.Component {

    render() {


        let Button;
        if (this.props.ShowButton) {
            Button = <button className="btn btn-success btn-block" onClick={() => this.props.changePage(this.props.ButtonUrl)}>{this.props.ButtonText}</button>;
        }

        return (
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h4>{this.props.Header}</h4>
                        </div>
                        <p>{this.props.Body} {Button}</p>
                    </div>
                </div>
            </div>
        );
    }

}

export default Card;
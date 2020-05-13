import React from 'react';
//import Websocket from 'react-websocket';

class PaymentMethodButton extends React.Component {

    constructor() {
        super();
        this.handlePress = this.handlePress.bind(this);
    }

    handlePress(event) {

        this.props.payItems(this.props.productQueue, event.target.getAttribute("data-PMID"), this.props.POS.ID);
        


    }
    render() {

        let btnclass = `btn ${this.props.PaymentMethod.color} btn-lg active btn-block`;

        return (
            <div key={this.props.PaymentMethod.ID} className="col-6 col-sm-4 mb-4">
                <button data-PMID={this.props.PaymentMethod.ID} onClick={this.handlePress} className={btnclass} style={{height: "100px"}}>{this.props.PaymentMethod.Payment}</button>
            </div>
        );
    }

}

export default PaymentMethodButton;
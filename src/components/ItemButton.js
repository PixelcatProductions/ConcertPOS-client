import React from 'react';
//import Websocket from 'react-websocket';

class ItemButton extends React.Component {

    constructor() {
        super();
        this.state = {
            amount: 0,
        }
        this.handleAdd = this.handleAdd.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    handleAdd() {
        //this.setState({ amount: this.state.amount + 1 });
        this.props.changeQuantity(this.props.Product, this.props.Product.Amount + 1);
        this.props.addProduct(this.props.Product);
    }

    handleRemove() {
        if (this.props.Product.Amount === 0) return;
        //this.setState({ amount: this.state.amount - 1 });
        this.props.changeQuantity(this.props.Product, this.props.Product.Amount - 1);
        this.props.removeProduct(this.props.Product);
    }

    render() {


        let DepositLabel = "";
        let CrewLabel = "";

        if (this.props.Product.Deposit) {
            DepositLabel = <sup><span className="badge badge-success">Pfand +{this.props.DepositPrice.Price}€</span></sup>;
        }
        if (this.props.Product.CrewBlocked) {
            CrewLabel = <sup><span className="badge badge-danger">No Crew</span></sup>;
        }

        return (
            <div key={this.props.Product.ID} className="h-100 mb-1 flex-fill">
                <div className="text-center h-100">
                    <div className="btn-group-vertical h-100 w-100">
                        <button onClick={this.handleAdd} className="btn btn-primary btn-lg btn-block">
                            <h5 className="display-7 text-white">{this.props.Product.ProductName}</h5>
                            <div className="display-7 text-white">{this.props.Product.Price}€</div>
                            <p className="lead text-white"><span>{this.props.Product.Amount}</span> STK{DepositLabel}{CrewLabel}</p>
                        </button>
                        <button onClick={this.handleRemove} className="btn btn-danger btn-lg btn-block">Entfernen</button>
                    </div>
                </div>
            </div>
        );
    }

}

export default ItemButton;
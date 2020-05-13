import React from 'react';
import ItemButton from './ItemButton';
import Noty from 'noty';
import PriceCalculator from './PriceCalculator';
import PaymentMethodButton from './PaymentMethodButton';
import Parser from 'html-react-parser';
//import Websocket from 'react-websocket';

class ViewPOS extends React.Component {



    constructor(props) {
        super(props);

        this.state = {
            productQueue: [],
            TotalPrice: 0.00,
        }

        this.props.refreshProducts();
        this.props.refreshPM();


        this.props.WebSocket.sendMessage(JSON.stringify({
            "command": "getdeposit",
            "parameters": {
                "api_key": localStorage.getItem("api_key"),
            }
        }));


        this.props.registerDevice(true);

        this.addProduct = this.addProduct.bind(this);
        this.payItems = this.payItems.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
        this.resetProducts = this.resetProducts.bind(this);
        this.leavePOS = this.leavePOS.bind(this);
        //this.handleWS = this.props.onWSMessage.bind(this);


    }

    leavePOS() {
        this.props.setProducts([]);
        this.props.setPM([]);
        this.props.changePage("selectworkplace", {});
    }



    addProduct(Product) {


        let ProductQueue = this.state.productQueue;

        ProductQueue.push(Product);


        let AddDeposit = 0;

        if (Product.Deposit) {
            AddDeposit = this.props.DepositPrice.Price;
        }

        this.setState({
            productQueue: ProductQueue,
            TotalPrice: this.state.TotalPrice + Product.Price + AddDeposit
        });


        new Noty({
            text: `${Product.ProductName} wurde hinzugefügt!`,
            type: "success",
            timeout: 1000,
            theme: "bootstrap-v4",
        }).show();

    }

    payItems(Items, PaymentMethod, POS) {


        this.props.WebSocket.sendMessage(JSON.stringify({
            "command": "payitems",
            "parameters": {
                "api_key": localStorage.getItem("api_key"),
                "Products": this.props.products,
                "PaymentMethod": PaymentMethod,
                "POSID": POS,
            }
        }));

        this.resetProducts();
    }


    resetProducts() {
        for (var index in this.props.products) {
            var Product = this.props.products[index];
            this.props.changeQuantity(Product, 0);
        }

        this.props.setProducts(this.props.productsStatic);

        this.setState({
            productQueue: [],
            TotalPrice: 0
        });
    }


    removeProduct(Product) {
        let ProductQueue = this.state.productQueue;

        var index = ProductQueue.findIndex(p => p === Product);


        ProductQueue.splice(index, 1);

        let AddDeposit = 0;

        if (Product.Deposit) {
            AddDeposit = this.props.DepositPrice.Price;
        }


        this.setState({
            productQueue: ProductQueue,
            TotalPrice: this.state.TotalPrice - Product.Price - AddDeposit
        });

        new Noty({
            text: `${Product.ProductName} wurde entfernt!`,
            type: "success",
            timeout: 1000,
            theme: "bootstrap-v4",
        }).show();
    }

    render() {

        if (process.env.NODE_ENV === "development") {
            console.log("[this.state.products] ", this.props.products);
            console.log("[this.props.productsLoading] ", this.props.productsLoading);
        }



        if (this.props.WorkplaceData.admin || this.props.WorkplaceData.special) {
            return (
                <div className="text-center">
                    <h1>Dieses Interface kann nicht über den Client aufgerufen werden!</h1>
                </div>
            );
        }

        if (Object.keys(this.props.products).length === 0) {
            return (
                <div className="text-center">
                    <h1>Es sind keine Produkte verfügbar! <button className="btn btn-primary" onClick={this.props.refreshProducts}>Neuladen</button></h1>
                </div>
            );
        }


        const Products = (props) => {
            // array of N elements, where N is the number of rows needed
            const rows = [...Array(Math.ceil(props.products.length / 6))];
            // chunk the products into the array of rows
            const productRows = rows.map((row, idx) => props.products.slice(idx * 6, idx * 6 + 6));
            // map the rows as div.row
            const content = productRows.map((row, idx) => (
                <div className="row" key={idx}>
                    {row.map(product => <div key={product} className="col-md-2 d-flex flex-column">

                        <ItemButton
                            changeQuantity={props.changeQuantity}
                            DepositPrice={props.DepositPrice}
                            addProduct={this.addProduct}
                            removeProduct={this.removeProduct}
                            Product={product} />

                    </div>)}
                </div>)
            );
            return (
                <div>
                    {content}
                </div>
            );
        }

        return (
            <div className="container">

                <Products
                    products={this.props.products}
                    DepositPrice={this.props.DepositPrice}
                    changeQuantity={this.props.changeQuantity}
                />
                <PriceCalculator
                    TotalPrice={this.state.TotalPrice}
                    refreshPM={this.props.refreshPM}
                    resetProducts={this.resetProducts}
                    RefreshButtonText={this.props.RefreshButtonText}
                    RefreshButtonColor={this.props.RefreshButtonColor}
                    leavePOS={this.leavePOS}
                    refreshProducts={this.props.refreshProducts} />

                <div className="row">
                    {this.props.paymentmethods.map(paymentmethod => {
                        return (
                            <PaymentMethodButton
                                POS={this.props.WorkplaceData}
                                productQueue={this.state.productQueue}
                                payItems={this.payItems}
                                PaymentMethod={paymentmethod} />
                        )
                    })}
                </div>
            </div>
        );
    }

}

export default ViewPOS;
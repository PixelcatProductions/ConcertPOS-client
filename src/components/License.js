import React from 'react';
import * as Package from '../../package.json';
//import Websocket from 'react-websocket';

class License extends React.Component {

    render() {



        let Button = <button className="btn btn-primary w-100" onClick={() => this.props.changePage("selectworkplace", {})}>Zurück</button>;


        let Alert;
        let CanGoBack = true;


        if (this.props.License.Active === "0") {
            Alert = <div className="alert alert-danger">
                Deine Lizenz ist nicht aktiv, du kannst ConcertPOS nicht benutzen!
            </div>
            CanGoBack = false;
        }
        if (new Date() < Date.parse(this.props.License.Created)) {
            Alert = <div className="alert alert-danger">
                Deine Lizenz ist noch nicht aktiv, du kannst ConcertPOS nicht benutzen!
            </div>
            CanGoBack = false;
        }

        if (new Date() > Date.parse(this.props.License.Expires)) {
            Alert = <div className="alert alert-danger">
                Deine Lizenz ist nicht mehr aktiv, du kannst ConcertPOS nicht benutzen!
            </div>
            CanGoBack = false;
        }

        if (!CanGoBack) {
            Button = "";
        }

        return (
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h4>Lizenz Informationen</h4>
                        </div>
                        {Alert}
                        <h5>Lizensiert für: {this.props.License.Name}</h5>
                        <h5>Lizenzschlüssel: {this.props.License.LicenseKey}</h5>
                        <h5>Lizenz Aktiv: {(this.props.License.Active) === "1" ? "Ja" : "Nein"}</h5>
                        <h5>Lizenz Typ: {this.props.License.Type}</h5>
                        <h5>Lizenz Device Limit: {(this.props.License.DeviceLimit) === "0" ? "∞" : this.props.License.DeviceLimit}</h5>
                        <h5>Lizenz Ticket Limit: {(this.props.License.TicketLimit) === "0" ? "∞" : this.props.License.TicketLimit}</h5>
                        <h5>Lizenz Product Limit: {(this.props.License.ProductLimit) === "0" ? "∞" : this.props.License.ProductLimit}</h5>
                        <h5>Lizenz Payment Limit: {(this.props.License.PaymentLimit) === "0" ? "∞" : this.props.License.PaymentLimit}</h5>
                        <h5>Lizenz POS Limit: {(this.props.License.POSLimit) === "0" ? "∞" : this.props.License.POSLimit}</h5>
                        <h5>Lizensiert von: {this.props.License.Created}</h5>
                        <h5>Lizensiert bis: {(this.props.License.Expires === null ? "Kein Ablaufdatum" : this.props.License.Expires)}</h5>
                        <hr />
                        <div className="card-title">
                            <h4>Instanz Informationen</h4>
                        </div>
                        <h5>Websocket URL: {this.props.WebSocketURI}</h5>
                        <h5>Instance Shard: {this.props.Shard}</h5>
                        <h5>Websocket Auth Token: {(process.env.NODE_ENV === "development" ? localStorage.getItem("api_key") : "HIDDEN")}</h5>
                        <h5>ConcertPOS Version: {Package.version}</h5>
                        <h5>Release Candidate: {process.env.NODE_ENV}</h5>
                        <h5>Remote Ticket Limit: {this.props.Config.ticket_limit}</h5>
                        <div className="btn-group d-flex">
                            {Button}
                            <button className="btn btn-success w-100" onClick={this.props.refreshLicense}>Aktualisieren</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

}

export default License;
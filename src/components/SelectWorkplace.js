import React from 'react';
import Noty from 'noty';
//import Websocket from 'react-websocket';

class SelectWorkplace extends React.Component {


    constructor(props) {
        super(props);
        this.state = { "workplace": "none" };
        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(event) {
        this.setState({ workplace: event.target.value });
        if (event.target.value === "none") return;

        let WorkplaceFiltered = this.props.workplaces.filter(function (workplace) {
            if (workplace.ID === Number.parseInt(event.target.value)) {
                return workplace;
            }
            return null;
        })[0];

        if (WorkplaceFiltered.password) {
            new Noty({
                theme: "bootstrap-v4",
                text: "Dieser Bereich erfordert ein Passwort!",
                timeout: 5000,
                type: "warning"
            }).show();
            return;
        }
        this.props.changePage("viewpos", { ID: event.target.value, Data: WorkplaceFiltered });
    }

    render() {
        return (
            <div className="container h-100">
                <div id="workplace">
                    <div className="row justify-content-center align-self-crow align-items-center h-100enter">
                        <div className="col-6 mx-auto">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title">
                                        <h4>Arbeitsplatz auswählen</h4>
                                    </div>

                                    <div className="form-group">
                                        <select className="form-control" value={this.state.workplace} onChange={this.handleChange}>
                                            <option key="none" value="none" disabled>Wähle deinen Arbeitsplatz aus</option>
                                            {this.props.workplaces.map(workplace => {
                                                if (!workplace.enabled) return null;
                                                if (workplace.special) return null;
                                                if (workplace.admin) return null;

                                                return (
                                                    <option key={workplace.ID} value={workplace.ID}>{workplace.PointOfSale}</option>
                                                )
                                            }).filter(Boolean)}
                                        </select>
                                    </div>
                                    <div className="btn-group d-flex">
                                        <button className="btn btn-warning w-100" onClick={() => this.props.changePage("setup", {})}>Einstellungen</button>
                                        <button className="btn btn-primary w-100" onClick={this.props.refreshPOS}>Aktualisieren</button>
                                        <button className="btn btn-info w-100" onClick={() => this.props.changePage("info", {})}>Informationen</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default SelectWorkplace;
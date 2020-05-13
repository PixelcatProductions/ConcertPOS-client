import React from 'react';
//import Websocket from 'react-websocket';
import * as uuid from "uuid";

class Setup extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            instance_slug: localStorage.getItem("instance_slug"),
            api_key: localStorage.getItem("api_key"),
            identifier: localStorage.getItem("identifier"),
        }
    }


    handleChange(event) {

        this.setState({
            [event.target.getAttribute("data-key")]: event.target.value
        });

        localStorage.setItem(event.target.getAttribute("data-key"), event.target.value);

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
                                        <h4>ConcertPOS einrichten</h4>
                                    </div>
                                    <label>Instanz Slug:</label>
                                    <input className="form-control" data-key="instance_slug" onChange={this.handleChange.bind(this)} value={this.state.instance_slug} />
                                    <label>API Key:</label>
                                    <input className="form-control" data-key="api_key" onChange={this.handleChange.bind(this)} value={this.state.api_key} />
                                    <label>Gerätename:</label>
                                    <input className="form-control" value={this.state.identifier} readOnly/>
                                    <hr/>
                                    <button className="btn btn-success btn-block" onClick={() => window.location.reload(false)}>Neustarten</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Setup;
import React from 'react';
//import Websocket from 'react-websocket';

class Auth extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            password: "",
        }
        this.verifyPassword = this.verifyPassword.bind(this);
    }

    verifyPassword() {

        this.props.refWebSocket.sendMessage(JSON.stringify({
            "command": "verifyauth",
            "parameters": {
                "api_key": localStorage.getItem("api_key"),
                "password": this.state.password,
                "workplace": this.props.workplaceid
            }
        }));

    }

    handleInput(event) {
        this.setState({
            password: event.target.value
        })
    }

    render() {


        return (
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h4>Authentifizierung erforderlich</h4>
                        </div>
                        <label>Passwort:</label>
                        <input type="password" className="form-control" onChange={this.handleInput.bind(this)} value={this.state.password} />
                        <br />
                        <div className="btn-group d-flex">
                            <button className="btn btn-success w-100" onClick={this.verifyPassword}>Einloggen</button>
                            <button className="btn btn-primary w-100" onClick={() => this.props.changePage("selectworkplace", {})}>Zurück</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Auth;
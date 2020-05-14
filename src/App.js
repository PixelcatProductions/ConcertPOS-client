import React from 'react';
import SelectWorkplace from './components/SelectWorkplace';
import Header from './components/Header';
import ViewPOS from './components/ViewPOS';
import Overlay from './components/Overlay';
import './Global.css';
import Noty from 'noty';
import Websocket from 'react-websocket';
import Setup from './components/Setup';
import Card from './components/Card';
import License from './components/License';
import * as uuid from 'uuid';

class App extends React.Component {



  constructor() {
    super();

    let Shards = process.env.REACT_APP_SHARDINSTANCES.split(",");

    let randomshard = Shards[Math.floor(Math.random() * Shards.length)];

    this.state = {
      WebSocketURI: (process.env.REACT_APP_AUTHSERVER).replace("{shard}", randomshard) + localStorage.getItem("instance_slug"),
      ConfigLoaded: false,
      Shard: randomshard,
      page: "selectworkplace",
      previousPage: null,
      previousWorkspace: {},
      workplaceid: 0,
      License: {},
      products: [],
      ErrorButtonUrl: "selectworkspace",
      ErrorButtonText: "Zürück",
      productsStatic: [],
      connected: false,
      hasDisconnected: false,
      posLoading: true,
      productsLoading: true,
      pmLoading: true,
      overlayState: "overlay overlay-show",
      overlayText: "Verbindung wird hergestellt...",
      paymentmethods: [],
      depositprice: 0,
      workplaces: [],
      RefreshButtonText: "Kasse updaten",
      RefreshButtonColor: "btn-primary",
      WorkplaceData: null,
    }

    this.changePage = this.changePage.bind(this);
    this.changeQuantity = this.changeQuantity.bind(this);
    this.refreshProducts = this.refreshProducts.bind(this);
    this.refreshPOS = this.refreshPOS.bind(this);
    this.refreshPM = this.refreshPM.bind(this);
    this.goBack = this.goBack.bind(this);
    this.setProducts = this.setProducts.bind(this);
    this.setPM = this.setPM.bind(this);
    this.refreshLicense = this.refreshLicense.bind(this);
    this.refreshConfig = this.refreshConfig.bind(this);
    this.registerDevice = this.registerDevice.bind(this);

    if (localStorage.getItem("identifier") === null) {
      localStorage.setItem("identifier", uuid.v4());
    }

  };


  onWSConnect() {
    this.setState({
      connected: true
    })

    if (this.state.hasDisconnected) {
      //this.goBack();
      this.setState({
        hasDisconnected: false,
        overlayState: "",
        overlayText: ""
      });
      return;
    }

    this.setState({
      overlayState: "",
      overlayText: ""
    });
    this.refreshPOS();
    this.refreshLicense();
    this.refreshConfig();
    this.registerDevice();
  }

  onWSDisconnect() {
    if (this.state.connected) {
      this.setState({
        connected: false,
        hasDisconnected: true,
        overlayState: "overlay overlay-show",
        overlayText: "Verbindung verloren! Versuche erneut zu verbinden"
      })
    }
  }





  changeQuantity(Product, Quantity) {
    const newProducts = this.state.products.map(obj => {
      return obj.ID === Product.ID ? { ...obj, Amount: Quantity } : obj
    });
    this.setState({
      products: newProducts
    });

  }


  registerDevice(workplace = false) {
    if (!workplace) {
      this.refWebSocket.sendMessage(JSON.stringify({
        "command": "registerdevice",
        "parameters": {
          "api_key": localStorage.getItem("api_key"),
          "UUID": localStorage.getItem("identifier"),
        }
      }));
      return;
    }
    this.refWebSocket.sendMessage(JSON.stringify({
      "command": "registerdevice",
      "parameters": {
        "api_key": localStorage.getItem("api_key"),
        "UUID": localStorage.getItem("identifier"),
        "workplace": this.state.workplaceid
      }
    }));
  }

  refreshConfig() {
    this.refWebSocket.sendMessage(JSON.stringify({
      "command": "getconfig",
      "parameters": {
        "api_key": localStorage.getItem("api_key"),
      }
    }));
  }

  refreshLicense() {
    this.refWebSocket.sendMessage(JSON.stringify({
      "command": "getlicense",
      "parameters": {
        "api_key": localStorage.getItem("api_key"),
      }
    }));
  }

  handleWS(data) {
    var WSData = JSON.parse(data);

    if (WSData.type === "event") {
      if (WSData.result.event === "listproducts") {
        this.setState({
          products: WSData.result.parameters.Products,
          productsStatic: WSData.result.parameters.Products,
          productsLoading: false
        });
      }
      if (WSData.result.event === "listpos") {
        this.setState({
          workplaces: WSData.result.parameters.POS,
          posLoading: false
        });
      }
      if (WSData.result.event === "listpm") {
        this.setState({
          paymentmethods: WSData.result.parameters.PaymentMethods,
          pmLoading: false
        });
      }

      if (WSData.result.event === "getconfig") {
        this.setState({
          Config: WSData.result.parameters.Config,
        });

      }
      if (WSData.result.event === "getlicense") {
        this.setState({
          License: WSData.result.parameters.License,
        });


        if (this.state.License.Active === "0") {
          this.setState({
            License: WSData.result.parameters.License,
            LicenseNoBackButton: true
          });
          this.changePage("info", {});
        }
      }
      if (WSData.result.event === "getdeposit") {
        this.setState({
          depositprice: WSData.result.parameters.Deposit
        });
      }

      if (WSData.result.event === "payitem") {
        new Noty({
          text: `${WSData.result.parameters.Items} Produkte wurden erfolgreich eingebucht!`,
          type: "success",
          timeout: 1000,
          theme: "bootstrap-v4",
        }).show();
      }

    }
    
	if(WSData.type === "broadcast"){
	  if (WSData.result.message === "updatepos") {
        this.setState({
          RefreshButtonText: "Kasse updaten (Update ausstehend!)",
          RefreshButtonColor: "btn-danger btn-block",
        });
      }
	}

    if (WSData.type === "error") {
      if (WSData.result.error === "missing_parameter_api") {
        this.setState({
          ErrorHeader: "Ein Fehler ist aufgetreten!",
          ErrorBody: "Websocket Fehler (missing_parameter_api), hier ist ein Programmierfehler :(! Ich kann leider nicht weiterarbeiten da ich nicht mit der API kommunizieren kann :(",
          ErrorButtonShow: false
        });
        this.changePage("error", {});
      }
      if (WSData.result.error === "invalid_instance") {
        this.setState({
          ErrorHeader: "Ein Fehler ist aufgetreten!",
          ErrorBody: "Websocket Fehler (invalid_instance), deine ConcertPOS Instanz existiert nicht! Ich kann leider nicht weiterarbeiten da ich nicht mit der API kommunizieren kann :(",
          ErrorButtonShow: true,
          ErrorButtonUrl: "setup",
          ErrorButtonText: "Einrichten"
        });
        this.changePage("error", {});
      }
      if (WSData.result.error === "no_api_key") {
        this.setState({
          ErrorHeader: "Ein Fehler ist aufgetreten!",
          ErrorBody: "Websocket Fehler (no_api_key), deine ConcertPOS Instanz hat keinen API Key gesetzt, bitte lege einen in der Verwaltung an  :(! Ich kann leider nicht weiterarbeiten da ich nicht mit der API kommunizieren kann :(",
          ErrorButtonShow: false
        });
        this.changePage("error", {});
      }

      if (WSData.result.error === "api_key_mismatch") {
        this.setState({
          ErrorHeader: "Ein Fehler ist aufgetreten!",
          ErrorBody: "Websocket Fehler (api_key_mismatch), dein gesetzter API Key stimmt nicht mit der angesteuerten ConcertPOS Instanz überein! Ich kann leider nicht weiterarbeiten da ich nicht mit der API kommunizieren kann :(",
          ErrorButtonShow: true,
          ErrorButtonUrl: "setup",
          ErrorButtonText: "Einrichten"
        });
        this.changePage("error", {});
      }
    }

  }

  goBack() {
    this.changePage(this.state.previousPage, this.state.previousWorkspace);
  }

  changePage(Page, Workplace) {
    if (process.env.NODE_ENV === "development") {
      console.log("[changePage(Page, Workplace)] Page => ", Page);
      console.log("[changePage(Page, Workplace)] Workplace => ", Workplace);

      console.log("[changePage(Page, Workplace)] state.previousPage => ", this.state.page);
      console.log("[changePage(Page, Workplace)] state.previousWorkspace => ", this.state.workplaceid);
    }

    let previousWorkspace = this.state.workplaceid;


    if (previousWorkspace === undefined || previousWorkspace === null) {
      previousWorkspace = null;
    }

    if (Workplace === undefined || Workplace === null) {
      Workplace = { ID: 0, Data: {} };
    }

    this.setState({
      page: Page,
      previousPage: this.state.page,
      previousWorkspace: previousWorkspace,
      workplaceid: Workplace.ID,
      WorkplaceData: Workplace.Data
    });
    /*
    new Noty({
      text: "Seite wird gewechselt...",
      type: "info",
      timeout: 1000,
      theme: "bootstrap-v4",
    }).show();
    */
  }


  refreshPM() {


    this.setState({
      pmLoading: true,
      RefreshButtonText: "Kasse updaten",
      RefreshButtonColor: "btn-primary",
    });

    this.refWebSocket.sendMessage(JSON.stringify({
      "command": "listpm",
      "parameters": {
        "api_key": localStorage.getItem("api_key"),
        "POSID": this.state.workplaceid
      }
    }));
  }

  setProducts(Products) {
    this.setState({
      products: Products
    });
  }
  setPM(Products) {
    this.setState({
      paymentmethods: Products
    });
  }

  refreshProducts() {

    this.setState({
      productsLoading: true,
      RefreshButtonText: "Kasse updaten",
      RefreshButtonColor: "btn-primary",
    });

    this.refWebSocket.sendMessage(JSON.stringify({
      "command": "listproducts",
      "parameters": {
        "api_key": localStorage.getItem("api_key"),
        "POSID": this.state.workplaceid
      }
    }));
  }


  refreshPOS() {


    this.setState({
      posLoading: true,
      RefreshButtonText: "Kasse updaten",
      RefreshButtonColor: "btn-primary",
    });

    this.refWebSocket.sendMessage(JSON.stringify({
      "command": "listpos",
      "parameters": {
        "api_key": localStorage.getItem("api_key")
      }
    }));
  }

  render() {
    let page;
    let overlay;
    let websocket;

    switch (this.state.page) {
      case 'selectworkplace':
        page = <SelectWorkplace
          WebSocket={this.refWebSocket}
          changePage={this.changePage}
          workplaces={this.state.workplaces}
          refreshPOS={this.refreshPOS}
        />;
        break;
      case 'viewpos':
        page = <ViewPOS
          refreshPM={this.refreshPM}
          refreshProducts={this.refreshProducts}
          productsLoading={this.state.productsLoading}
          WorkplaceData={this.state.WorkplaceData}
          pmLoading={this.state.pmLoading}
          changeQuantity={this.changeQuantity}
          registerDevice={this.registerDevice}
          DepositPrice={this.state.depositprice}
          onWSMessage={this.handleWS}
          products={this.state.products}
          productsStatic={this.state.productsStatic}
          paymentmethods={this.state.paymentmethods}
          setProducts={this.setProducts}
          setPM={this.setPM}
          changePage={this.changePage}
          WebSocket={this.refWebSocket}
          workplaceid={this.state.workplaceid}
          RefreshButtonText={this.state.RefreshButtonText}
          RefreshButtonColor={this.state.RefreshButtonColor}
        />;
        break;

      case 'error':
        page = <Card
          Header={this.state.ErrorHeader}
          Body={this.state.ErrorBody}
          ShowButton={this.state.ErrorButtonShow}
          ButtonUrl={this.state.ErrorButtonUrl}
          ButtonText={this.state.ErrorButtonText}
          goBack={this.goBack}
          changePage={this.changePage}
        />
        break;

      case 'info':
        page = <License
          License={this.state.License}
          Config={this.state.Config}
          refreshConfig={this.refreshConfig}
          refreshLicense={this.refreshLicense}
          WebSocketURI={this.state.WebSocketURI}
          Shard={this.state.Shard}
          LicenseNoBackButton={this.state.LicenseNoBackButton}
          changePage={this.changePage}
        />
        break;

      case 'setup':
        page = <Setup
          changePage={this.changePage}
        />
        break;

      default:
        page = <Card
          Header="Diese Seite konnte ich nicht finden!"
          Body="Hast du dich vielleicht vertippt?"
          ShowButton={true}
          goBack={this.goBack}
        />
    }


    if (!this.state.connected && localStorage.getItem("instance_slug") !== null) {

      if (typeof localStorage.getItem("instance_slug") !== "undefined") {
        overlay = <Overlay overlayState={this.state.overlayState} overlayText={this.state.overlayText} />
      }
    }

    if (localStorage.getItem("instance_slug") !== null) {
      if (typeof localStorage.getItem("instance_slug") === "undefined") {
        page = <Setup
          changePage={this.changePage} />
      } else {
        websocket = <Websocket url={this.state.WebSocketURI}
          onMessage={this.handleWS.bind(this)}
          onOpen={this.onWSConnect.bind(this)}
          onClose={this.onWSDisconnect.bind(this)}
          ref={Websocket => {
            this.refWebSocket = Websocket;
          }} />;
      }
    } else {
      page = <Setup
        changePage={this.changePage} />
    }

    return (
      <div id="app-container">
        <Header />
        {page}
        {overlay}

        {websocket}
      </div>

    );



  }

}

export default App;
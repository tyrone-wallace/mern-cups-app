import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import AddItem from "./components/manager/AddItem";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ItemsList from "./components/manager/ItemsList";
import CustomerMenu from "./components/customer/CustomerMenu";
import ManagerControlCenter from "./components/manager/ManagerControlCenter";
import Chart from "./components/manager/Chart";
import ConfirmOrder from "./components/customer/ConfirmOrder";
import "./index.css";

const NotFound = () => (
  <div>
    <h1>This page connot be found. Error Code: 404</h1>
  </div>
);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
      user: {},
      username: "",
    };

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(data, username) {
    this.setState({
      loggedInStatus: "LOGGED_IN",
      user: data,
      username: username,
    });
  }

  render() {
    return (
      <Router>
        <div className="bg">
          {/* NavBar rendered always as header  */}

          <NavBar
            loggedInStatus={this.state.loggedInStatus}
            username={this.state.username}
          />

          <Switch>
            <Route
              exact
              path={"/"}
              render={(props) => (
                <Home
                  {...props}
                  handleLogin={this.handleLogin}
                  loggedInStatus={this.state.loggedInStatus}
                />
              )}
            />

            <Route
              exact
              path={"/add"}
              render={(props) => (
                <AddItem
                  {...props}
                  loggedInStatus={this.state.loggedInStatus}
                />
              )}
            />

            <Route
              exact
              path={"/list"}
              render={(props) => (
                <ItemsList
                  {...props}
                  loggedInStatus={this.state.loggedInStatus}
                />
              )}
            />

            <Route
              exact
              path={"/menu"}
              render={(props) => (
                <CustomerMenu
                  {...props}
                  loggedInStatus={this.state.loggedInStatus}
                  username={this.state.username}
                  account_balance={this.state.user.account_balance}
                />
              )}
            />

            <Route
              exact
              path={"/control"}
              render={(props) => (
                <ManagerControlCenter
                  {...props}
                  loggedInStatus={this.state.loggedInStatus}
                />
              )}
            />

            <Route
              exact
              path={"/confirm"}
              render={(props) => (
                <ConfirmOrder
                  {...props}
                  loggedInStatus={this.state.loggedInStatus}
                />
              )}
            />

            <Route
              exact
              path={"/chart"}
              render={(props) => (
                <Chart {...props} loggedInStatus={this.state.loggedInStatus} />
              )}
            />

            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;

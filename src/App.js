import React, {Component} from 'react';
import './App.css';
import {Route, Switch, withRouter} from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import * as firebase from "./services/Firebase"
import {Dashboard, Loading, Notification} from "./containers";
import {Background, BottomNavbar, NotFound, TopNavbar} from "./components";
import {Breakpoint} from "react-socks";
import ARModeButtonImage from "./components/BottomNavbar/images/ARModeButton.png";
import {showNotification} from "./service-worker/NotificationServiceWorker";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: '',
      isLoading: true,
      isLoggedIn: false,
      user: {},
      userData: {},
    }
  }

  componentDidMount = async () => {
    const title = "Helpers Web AR";
    const options = {
      body: "Hey, there is someone need your help around you! check it now",
      icon: ARModeButtonImage,
      badge: ARModeButtonImage
    };
    showNotification(title, options);
    await this.checkIsLoggedIn();
  };

  checkIsLoggedIn = async () => {
    await firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          console.log(user);
          await firebase.db.ref('users').orderByChild('uid').equalTo(user.uid)
            .on('value', snapshot => {
              let userData = [];

              if (snapshot.exists()) {
                snapshot.forEach((snap) => {
                  userData.push(snap.val())
                });
                // speakStart("Welcome to XStream XR");
              }

              else {
                userData = [{
                  uid: user.uid,
                  displayName: user.displayName,
                  email: user.email,
                  photoURL: user.photoURL,
                }]
              }

              this.setState({
                userData: userData[0],
                user: user,
                isLoading: false,
                isLoggedIn: true
              });
            })
        } catch (error) {
          this.setState({
            readError: error.message, loadingChats: false,
            user: {},
            userData: {},
            isLoading: false,
            isLoggedIn: false
          })
        }
      } else {
        this.setState({
          user: {},
          userData: {},
          isLoading: false,
          isLoggedIn: false
        })
      }
    })
  };

  setPage = (page) => {
    this.setLoading(true);
    setTimeout(() => {
      this.setLoading(false);
    }, 500);
    this.setState({page});
  };

  setLoading = (isLoading) => {
    this.setState({isLoading})
  };

  render() {
    const {isLoading, isLoggedIn, userData} = this.state;
    return (
      <div>

        <Breakpoint small down>

          {isLoading && (<Loading/>)}
          <TopNavbar/>
          <Background/>

          <div className="page-container">
            <Switch>

              {!isLoggedIn && !isLoading && (
                <div id='firebase-auth'>
                  <h1>Welcome!</h1>
                  <h3>Sign in to begin.</h3>
                  <StyledFirebaseAuth
                    uiConfig={firebase.uiConfig}
                    firebaseAuth={firebase.auth()}
                    />
                </div>
              )}

              {isLoggedIn && !isLoading && (
                <>
                  <Route
                    exact
                    path="/"
                    render={(props) => (
                      <Dashboard {...props} userData={userData}/>
                    )}
                  />

                  <Route
                    exact
                    path="/notification"
                    render={(props) => (
                      <Notification {...props} userData={userData}/>
                    )}
                  />
                </>
              )}

              {!isLoading && (
                <Route path="*" render={() => (
                  <NotFound/>
                )}/>
              )}

            </Switch>
          </div>

          {isLoggedIn && (
            <BottomNavbar setPage={this.setPage}/>
          )}
        </Breakpoint>

        {/*//entry ID : https://console.echoAR.xyz/geoarjs?key=<YOUR_API_KEY>&entry=<ENTRY_ID>*/}
        {/*noisy-recipe-0500*/}

        <Breakpoint medium up>
          <h2>Sorry, only available on Mobile Devices</h2>
        </Breakpoint>

      </div>
    )
  }
}

export default withRouter(App);

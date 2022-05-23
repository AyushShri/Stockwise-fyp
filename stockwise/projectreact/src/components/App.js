import React, { useEffect,useState,useRef } from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
// components
import Layout from "./Layout";

// pages
import Error from "../pages/error";
import Login from "../pages/login";

// context
import { useUserState } from "../context/UserContext";
import Modal from '@mui/material/Modal';
import { useDispatch,useSelector } from "react-redux";
import { SET_STOCK_STATE } from "../store/actionsConstants";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import useStyles from "../pages/dashboard/styles";
import { Typography } from "../components/Wrappers";

import {
  Grid,
  LinearProgress,
  Button,
  Box
} from "@material-ui/core";
import axios from "axios";
export default function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  // global
  var classes = useStyles();
  const [notificationArray,setNotificationArray] = useState([]);
  var { isAuthenticated } = useUserState();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    dispatch({
      type: SET_STOCK_STATE,
      payload: false
    })
  };

  const {stockState,stockData} = useSelector(reducer => reducer.dashboardReducer);
  const timerRef = useRef(null);
  useEffect(()=>{
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }
    
    timerRef.current = setInterval(() => {
      notificationApi();
    }, 5000);

    return () => {
      clearTimeout(timerRef.current)
    }
  },[])

  useEffect(()=>{
    if(isAuthenticated) {
      //timerRef.current = setInterval(() => {
        
      //}, 1000 * 10);
    }
  },[isAuthenticated])

  const notificationApi = () => {
    const AuthStr = 'Bearer '.concat(localStorage.getItem("id_token"));
    axios.post(`http://localhost:5000/api/v1/dashboard/checkPrefernces`,{} ,{ headers: { Authorization: AuthStr } })
      .then(function (response) {
        console.log(response)
        if (response.status === 200) {
          let notification = null;
          if(response?.data?.data?.length) {
            response?.data?.data?.map((item,index)=>{
              if(item.status) {
                notification = new Notification("Stock Update", item.options);
              }
            })
            setTimeout(()=>{
              axios.post(`http://localhost:5000/api/v1/dashboard/disablePrefernces`,{"status":0} ,{ headers: { Authorization: AuthStr } })
                .then(function (response) {
                  if (response.status === 200) {
                    console.log("success");
                  }
                })
                .catch(function (error){
                  console.log(error);
                })
            },5000)
          }
          
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <>
    <HashRouter>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/app/dashboard" />} />
        <Route
          exact
          path="/app"
          render={() => <Redirect to="/app/dashboard" />}
        />
        <Route
          exact
          path="/app"
          render={() => <Redirect to="/app/profile" />}
        />
        <Route
          exact
          path="/app"
          render={() => <Redirect to="/app/stockDetails" />}
        />
        <Route
          exact
          path="/app"
          render={() => <Redirect to="/app/viewAlert" />}
        />
         <Route
          exact
          path="/app"
          render={() => <Redirect to="/app/searchStock" />}
        />
        <PrivateRoute path="/app" component={Layout} />
        <PublicRoute path="/login" component={Login} />
        <Route component={Error} />
      </Switch>
    </HashRouter>
   
    </>
  );

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}

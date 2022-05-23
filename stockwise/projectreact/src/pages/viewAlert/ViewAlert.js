import { Grid, Typography, Modal, Button, TextField } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import useStyles from "./styles";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import PageTitle from "../../components/PageTitle/PageTitle";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";

export default function ViewAlert() {

  const classes = useStyles()
  const [alerts, setAlerts] = useState([])

  const getAllAlert = () => {
    const AuthStr = 'Bearer '.concat(localStorage.getItem("id_token"));
    axios.post(`http://localhost:5000/api/v1/dashboard/getAllAlertData`, {}, { headers: { Authorization: AuthStr } })
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
            setAlerts(res.data.data)
        }
      })
      .catch((err) => { })
  }
  useEffect(() => {
    getAllAlert()
  }, [])
  const deleteAlert = (item) => {
    const AuthStr = 'Bearer '.concat(localStorage.getItem("id_token"));
    axios.post(`http://localhost:5000/api/v1/dashboard/deleteAlertData`, {
      "id":item.id
  }, { headers: { Authorization: AuthStr } })
      .then((res) => {
        console.log(res)
        if (res) {
          if (res.data) {
            getAllAlert()
          }
        }
      })
      .catch((err) => { })
  } 
  return (
    <div className="app">
      <PageTitle title="Alerts" />
      <div>
        {alerts?.map(item => (
          <div className={classes.rowContainer}>
            <div>
              <Typography id="modal-modal-title" variant="body1">
                {`${item?.alert_type_name} (${item?.stock_name} - ${item?.preference_data})`}
              </Typography>
              <Typography id="modal-modal-title" variant="body">
                {item?.description}
              </Typography>
            </div>
            <div>
              <div onClick={() => deleteAlert(item)}>
                <DeleteIcon />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
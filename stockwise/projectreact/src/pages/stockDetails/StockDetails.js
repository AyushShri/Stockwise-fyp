import { Grid, Typography, Modal, Button, TextField } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import useStyles from "./styles";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import PageTitle from "../../components/PageTitle";
import { Alert } from '@mui/material';

export default function StockDetails() {

  var classes = useStyles();
  const [options, setOptions] = useState(null)
  const [series, setSeries] = useState(null)
  const [info, setInfo] = useState(null)
  const [price, setPrice] = useState(0);
  const history = useHistory();
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [data, setData] = useState([])
  const [selectedAlertType, setSelectedAlertType] = useState('')
  const [heading, setHeading] = useState('Select Alert Type')
  const [remark, setRemark] = useState('')
  const steps = [
    'Select Alert Type',
    'Customize Alert',
  ];

  const current = new Date();
  const newDate = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    
  useEffect(() => {
    console.log(history?.location?.state?.stockData);
    const AuthStr = 'Bearer '.concat(localStorage.getItem("id_token"));
    axios.post(`http://localhost:5000/api/v1/dashboard/getStockInformation`, {
      "stockName": history?.location?.state?.stockData['1. symbol']
    }, { headers: { Authorization: AuthStr } })
      .then((res) => {
        console.log(res)
        if (res) {
          if (res.data) {
            setInfo(res.data.data["Meta Data"])
            console.log("TEST:"+info);
            console.log("TEST2"+(res.data.data["Meta Data"]));

            
            const categories = []
            Object.keys(res.data.data["Technical Analysis: SMA"]).forEach((item, index) => { index < 10 && categories.push(item) })
            const data = categories.map((item, index) => { return index < 10 && item && parseInt(res.data.data["Technical Analysis: SMA"][item]["SMA"]) })
            setPrice(data[0]);
            setOptions({
              chart: {
                id: "basic-bar"
              },
              xaxis: {
                categories: categories
              }
            })
            setSeries([
              {
                name: "Price",
                data: data
              }
            ])

          }
        }
      })
      .catch((err) => {

      })
  }, [])

  useEffect(() => {
    if (isAlertOpen) {
      const AuthStr = 'Bearer '.concat(localStorage.getItem("id_token"));
      axios.get(`http://localhost:5000/api/v1/dashboard/getAlertType`, { headers: { Authorization: AuthStr } })
        .then(function (response) {
          if (response.status === 200) {
            console.log(response)
            setData(response?.data?.data)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [isAlertOpen])
  const handleOpen = () => {
    setIsAlertOpen(true)
  }
  const handleClose = () => {
    setIsAlertOpen(false)
    setActiveStep(0)
    setSelectedAlertType('')
    setPrice('')
    setRemark('')
    setHeading('Select Alert Type')
  }
  const onclickType = (e) => {
    if (heading === 'Select Alert Type') {
      const AuthStr = 'Bearer '.concat(localStorage.getItem("id_token"));
      axios.get(`http://localhost:5000/api/v1/dashboard/getSubAlertType?alertTypeId=${e.id}`, { headers: { Authorization: AuthStr } })
        .then(function (response) {
          if (response.status === 200) {
            setHeading('Price Target')
            setData(response?.data?.data)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    else if (heading === 'Price Target') {
      setSelectedAlertType(e)
      setActiveStep(1)
      setHeading('Upper Limit Price Target')
    }
  }
  const onSecondStepHandler = () => {
    if (price) {
      const AuthStr = 'Bearer '.concat(localStorage.getItem("id_token"));
      axios.post(`http://localhost:5000/api/v1/dashboard/storeAlertData`, {
        "alert_type_id": selectedAlertType?.alert_type_id,
        "alert_type_sub_id": selectedAlertType?.id,
        "preference_data": price,
        "remarks": remark,
        "stock_name": history?.location?.state?.stockData['1. symbol']
      }, { headers: { Authorization: AuthStr } })
        .then(function (response) {
          if (response.status === 201) {
            handleClose()
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    else {
      alert("Field should not be empty")
    }
  }


  return (
    <div className="app">
      <div>
        <Modal
          open={isAlertOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className={classes.modalBox}>
            <div className={classes.modalHeader}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add alert
              </Typography>
              <Typography onClick={handleClose} id="modal-modal-title" variant="h6" component="h2">
                x
              </Typography>
            </div>
            <div className={classes.stepperContainer}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>
            <Typography className={classes.textHeading} id="modal-modal-title" variant="h6" component="h2">
              {heading}
            </Typography>
            {
              heading === 'Upper Limit Price Target' &&
              <Typography id="modal-modal-title" variant="body">
                This alert will trigger when the price rises above the set target. The current price is {history?.location?.state?.stockData["8. currency"]+" "+price}.
              </Typography>
            }
            {heading !== 'Upper Limit Price Target' ?
              <div className={classes.modalContainer}>
                {
                  data.map((item) => (
                    <div onClick={() => onclickType(item)} className={classes.itemContainer}>
                      <Typography id="modal-modal-title" variant="body1">
                        {item.name}
                      </Typography>
                      <Typography id="modal-modal-title" variant="body">
                        {item.description}
                      </Typography>
                    </div>
                  ))
                }
              </div>
              : <div>
                <TextField
                  InputProps={{
                    classes: {
                      underline: classes.textFieldUnderline,
                      input: classes.textField,
                      className: classes.input
                    },
                  }}
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  margin="normal"
                  placeholder="Enter Preferences"
                  fullWidth
                />
                <TextField
                  InputProps={{
                    classes: {
                      underline: classes.textFieldUnderline,
                      input: classes.textField,
                      className: classes.input
                    },
                  }}
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                  margin="normal"
                  placeholder="Remarks"
                  fullWidth
                />
                <Button
                  variant="contained"
                  size="medium"
                  color="primary"
                  onClick={onSecondStepHandler}
                  className={classes.button}
                >
                  Next
                </Button>
              </div>
            }
          </div>
        </Modal>
      </div>
      <PageTitle title="Stock Details" button={<Button
        variant="contained"
        size="medium"
        color="secondary"
        onClick={handleOpen}
      >
        Alert
      </Button>} />
      {info && <Grid container><Grid item xs={12}>
        <div className={classes.cardContainer}>
          <Typography variant="body1" color="text" className={classes.nameText} noWrap>
            {`${info["1: Symbol"]}`}
          </Typography>
          <Typography color="text" colorBrightness="secondary">
            {info['2: Indicator']}
          </Typography>
          <Typography color="text" colorBrightness="secondary">
            {`${info["4: Interval"]} - ${info["6: Series Type"]}`}
          </Typography>
          <Typography color="text" colorBrightness="secondary">
            {`Today's Price: ${history?.location?.state?.stockData["8. currency"]+" "+price}`}
          </Typography>
          <div className={classes.bottomContainer}>
            <Typography
              color="text"
              colorBrightness="secondary"
              className={classes.serverOverviewElementText}
              noWrap
            >
            {`Last Refreshed: ${newDate}`}
            </Typography>
            <Typography
              color="text"
              colorBrightness="secondary"
              className={classes.serverOverviewElementText}
              noWrap
            >
              {`Score: ${info["7: Time Zone"]}`}
            </Typography>
          </div>
          <Typography
              color="text"
              colorBrightness="secondary"
              className={classes.serverOverviewElementText}
              noWrap
            >
              {/* {`Score: ${res.data.data["Technical Analysis: SMA"]}`} */}
            </Typography>

        </div>
      </Grid></Grid>}
      <Grid container>
        <Grid item xs={12}>
          <div className="row">
            <div className={`mixed-chart ${classes.graphContainer}`}>
              {series && <Chart
                options={options}
                series={series}
                type="line"
                width="80%"
              />}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
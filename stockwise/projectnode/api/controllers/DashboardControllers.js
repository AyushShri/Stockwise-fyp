const { default: axios } = require('axios');
const { NEW_API_KEY } = require('../constant/constant');
var request = require('request');
const AlertMaster = require('../models/AlertMaster');
const AlertSubMaster = require('../models/AlertSubMaster');
const Alerts = require('../models/Alerts');

exports.getDashboard = async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).send({
                message: "Body can not be empty!"
            });
        }

        let endpoints = [
            'https://financialmodelingprep.com/api/v3/stock_market/actives?apikey='+NEW_API_KEY,
            'https://financialmodelingprep.com/api/v3/stock_market/losers?apikey='+NEW_API_KEY,
            'https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey='+NEW_API_KEY,
        ];
        const axiosrequest1 = axios.get('https://financialmodelingprep.com/api/v3/stock/sectors-performance?apikey='+NEW_API_KEY);
        const axiosrequest2 = axios.get(endpoints[0]);
        const axiosrequest3 = axios.get(endpoints[1]);
        const axiosrequest4 = axios.get(endpoints[2]);
        
        await axios.all([axiosrequest1,axiosrequest2,axiosrequest3,axiosrequest4])
            .then(
                axios.spread(function(res1, res2, res3,res4) {
                    console.log(res2);
                    res.status(200).json({
                        error:false,
                        data:{
                            sectorPerformance:res1.data.sectorPerformance,
                            active:res2.data,
                            losers:res3.data,
                            gainers:res4.data,
                        },
                    })
                })
            )
            .catch((error)=>{
                res.status(500).json({
                    error:true,
                    message:error,
                })
            })
    } catch (error) {
        res.status(400).json({
            error:true,
            message:error.message,
        })
    }
};
exports.getStockInformation = async (req, res) => {
    try {
        const stockName = req.body.stockName
        let endpoints = "https://www.alphavantage.co/query?function=SMA&symbol="+stockName+"&interval=daily&time_period=10&series_type=open&apikey=A60QJSPXZANS0G5Q&datatype=json"
        
        request.get({
            url: endpoints,
            json: true,
            headers: {'User-Agent': 'request'}
        }, (err, response, data) => {
            if (err) {
                return res.status(400).json({
                    message: err,
                    error:true,
                });
            } else if (response.statusCode !== 200) {
                return res.status(400).json({
                    message: "something went wrong",
                    error:true,
                });
            } else {
                return res.status(200).json({
                    error:false,
                    data,
                })
            }
        });
        
            /* .then(function(response){
                
            }).catch((error)=>{
                res.status(500).json({
                    error:true,
                    message:error,
                })
            }) */
    } catch (error) {
        res.status(400).json({
            error:true,
            message:error.message,
        })
    }
};

exports.getAlertType = async (req, res) => {
    try {
        const [alerts] = await AlertMaster.getAlertType();
        if(alerts.length) {
            res.status(200).json({
                error:true,
                data:alerts,
            })
        } else {
            res.status(500).json({
                error:true,
                message:"alerts not available",
            })
        }
    } catch (error) {
        res.status(400).json({
            error:true,
            message:error.message,
        })
    }
};
exports.getSubAlertType = async (req, res) => {
    try {
        const alertTypeId = req.query.alertTypeId;
        const [alerts] = await AlertSubMaster.getSubAlertType(alertTypeId);
        if(alerts.length) {
            res.status(200).json({
                error:false,
                data:alerts,
            })
        } else {
            res.status(500).json({
                error:true,
                message:"alerts not available",
            })
        }
    } catch (error) {
        res.status(400).json({
            error:true,
            message:error.message,
        })
    }
};
exports.insertAlerts = async (req, res) => {
    try {
        if(!req.body) {
            res.status(400).send({
                message: "Body can not be empty!"
            });
        }
        const alertData = new Alerts({
            alert_type_id : req.body.alert_type_id,
            alert_type_sub_id : req.body.alert_type_sub_id,
            preference_data : req.body.preference_data,
            remarks : req.body.remarks,
            stock_name : req.body.stock_name,
            user_id : req.userData.userId,
        });
        const alerts = await Alerts.insertAlert(alertData);
        
         if(alerts[0].affectedRows) {
            res.status(201).json({
                error:false,
                data:"Alerts registered successfully",
            })
        } else {
            res.status(400).json({
                error:true,
                message:"something went wrong!!!",
            })
        }
    } catch (error) {
        res.status(400).json({
            error:true,
            message:error.message,
        })
    }
};
exports.updateAlerts = async (req, res) => {
    try {
        if(!req.body) {
            res.status(400).send({
                message: "Body can not be empty!"
            });
        }
        const alertData = new Alerts({
            id:req.body.id,
            alert_type_id : req.body.alert_type_id,
            alert_type_sub_id : req.body.alert_type_sub_id,
            preference_data : req.body.preference_data,
            remarks : req.body.remarks,
        });
        const alerts = await Alerts.updateAlert(alertData);
        
         if(alerts[0].affectedRows) {
            res.status(201).json({
                error:false,
                data:"Alerts updated successfully",
            })
        } else {
            res.status(400).json({
                error:true,
                message:"something went wrong!!!",
            })
        }
    } catch (error) {
        res.status(400).json({
            error:true,
            message:error.message,
        })
    }
};
exports.deleteAlerts = async (req, res) => {
    try {
        if(!req.body) {
            res.status(400).send({
                message: "Body can not be empty!"
            });
        }
        const alertData = new Alerts({
            id:req.body.id,
        });
        const alerts = await Alerts.deleteAlert(alertData);
        
         if(alerts[0].affectedRows) {
            res.status(200).json({
                error:false,
                data:"Alerts deleted successfully",
            })
        } else {
            res.status(200).json({
                error:true,
                message:"something went wrong!!!",
            })
        }
    } catch (error) {
        res.status(400).json({
            error:true,
            message:error.message,
        })
    }
};
exports.getAllAlerts = async (req, res) => {
    try {
        const [alerts] = await Alerts.getAllAlerts(req.userData.userId);
        if(alerts.length) {
            res.status(200).json({
                error:true,
                data:alerts,
            })
        } else {
            res.status(200).json({
                error:false,
                data:[],
            })
        }
    } catch (error) {
        res.status(400).json({
            error:true,
            message:error.message,
        })
    }
};
exports.getAlerts = async (req, res) => {
    try {
        if(!req.body) {
            res.status(400).send({
                message: "Body can not be empty!"
            });
        }
        const id = req.body.id;
        const [alerts] = await Alerts.getAlerts(id);
        if(alerts.length) {
            res.status(200).json({
                error:true,
                data:alerts[0],
            })
        } else {
            res.status(200).json({
                error:false,
                data:true,
            })
        }
    } catch (error) {
        res.status(400).json({
            error:true,
            message:error.message,
        })
    }
};

exports.checkPrefernces = async (req,res) => {
    try {
        const [alerts] = await Alerts.getAllAlertsByUserId(req.userData.userId)
        let notificationObj = [];
        const listOfPromises = Promise.all(alerts?.map(async(item,index)=>{
            let endpoints = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+item.stock_name+"&apikey=A60QJSPXZANS0G5Q&datatype=json"
            try {
                const response = await axios.get(endpoints);
                const date = response.data?.['Meta Data']?.['3. Last Refreshed'];
                const data = response.data?.['Time Series (Daily)']?.[date]?.['4. close'];
                let obj = {};
                if(item.tag === "less") {
                    if(Number(item.preference_data)<Number(data)) {
                        obj = {
                            status:true,
                            options:{
                                body: item.stock_name+" had decereased by "+item.preference_data,
                                icon: "https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?    auto=compress&cs=tinysrgb&dpr=1&w=500",
                                dir: "ltr"
                            }
                        }
                    } else {
                        obj = {
                            status:false,
                        }
                    }
                } else if(item.tag === "greater") {
                    if(Number(item.preference_data)>Number(data)) {
                        obj = {
                            status:true,
                            options:{
                                body: item.stock_name+" had increased by "+item.preference_data,
                                icon: "https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?    auto=compress&cs=tinysrgb&dpr=1&w=500",
                                dir: "ltr"
                            }
                        }
                    } else {
                        obj = {
                            status:false,
                        }
                    }
                } else if(item.tag === "greater/less") {
                    if(Number(item.preference_data)<Number(data)) {
                        obj = {
                            status:true,
                            options:{
                                body: item.stock_name+" had decreased by "+item.preference_data,
                                icon: "https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?    auto=compress&cs=tinysrgb&dpr=1&w=500",
                                dir: "ltr"
                            }
                        }
                    } else if(Number(item.preference_data)>Number(data)) {
                        obj = {
                            status:true,
                            options:{
                                body: item.stock_name+" had increased by "+item.preference_data,
                                icon: "https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?    auto=compress&cs=tinysrgb&dpr=1&w=500",
                                dir: "ltr"
                            }
                        }
                    } else {
                        obj = {
                            status:false,
                        }
                    }
                }
                return obj;
            } catch (error) {
                console.log(error);
            }
        }))
        const allResults = await listOfPromises
        res.status(200).json({
            error:false,
            data:allResults,
        })
    } catch (error) {
        res.status(400).json({
            error:true,
            message:error.message,
        })
    }
}

exports.disablePrefernces = async (req,res) => {
    try {
        if(!req.body) {
            res.status(400).send({
                message: "Body can not be empty!"
            });
        }
        const alerts = await Alerts.setAlertOnOff(req.body.status,req.userData.userId)
        if(alerts[0].affectedRows) {
            res.status(201).json({
                error:false,
                data:"Alerts deactvated/activated successfully",
            })
        } else {
            res.status(400).json({
                error:true,
                message:"something went wrong!!!",
            })
        }
    } catch (error) {
        res.status(400).json({
            error:true,
            message:error.message,
        })
    }
}

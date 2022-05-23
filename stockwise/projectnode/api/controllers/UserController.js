const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var request = require('request');

exports.login = async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).send({
                message: "Body can not be empty!"
            });
        }
        const user = new User({
            username: req.body.username 
        });
        const [users] = await User.login(user);
        if(users.length) {
            bcrypt.compare(req.body.password, users[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                      message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        username: users[0].username,
                        userId: users[0].id,
                        email:users[0].email,
                        mobile:users[0].mobile,
                        time:Date.now(),
                    },
                        `${process.env.JWT_KEY}`
                    );
                    res.status(200).json({
                        error:false,
                        data:{
                            users:users[0],
                            token
                        },
                    })
                } else {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
            });
        } else {
            res.status(204).json({
                error:false,
                data:[]
            })
        }
    } catch (error) {
        console.log("error",error);
        res.status(400).json({
            error:true,
            message:error.message,
        })
    }
};
exports.signup = (req, res) => {
    try {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              });
            } else {
                //const otp = Math.floor(100000 + Math.random() * 900000);
                const otp = 123456
                const user = new User({
                    username:req.body.username,
                    password:hash,
                    mobile:req.body.mobile,
                    email:req.body.email,
                    otp,
                });
                const users = await User.insertUser(user);
                if(users[0].affectedRows) {
                    res.status(201).json({
                        error:false,
                        data:"User registered successfully",
                    })
                } else {
                    res.status(400).json({
                        error:true,
                        message:"something went wrong!!!",
                    })
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            error:true,
            message:error.message,
        })
    }
};
exports.sendOtp = async(req, res) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        //const otp = 123456
        const user = new User({
            mobile:req.body.mobile,
        });
        const [checkUser] = await User.checkUser(user);
        
        const senderId="TECHFZ";
        const authKey="51ed3366a65d909977ade34af8c5523";
        const routeId="1";
        
        const message=otp+" is your login OTP. Treat this as confidential. Techfi Zone will never call you to verify your OTP. Techfi Zone Pvt Ltd.";
        
        const getData = 'mobileNos='+req.body.mobile+'&message='+encodeURI(message)+'&senderId='+senderId+'&routeId='+routeId;

        const endpoints = "http://msg.msgclub.net/rest/services/sendSMS/sendGroupSms?AUTH_KEY="+authKey+"&"+getData

        request.get({
            url: endpoints,
            json: true,
            headers: {'User-Agent': 'request'}
        }, async (err, response, data) => {
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
                if(checkUser.length) {
                    const user = new User({
                        mobile:req.body.mobile,
                        otp,
                    });
                    const users = await User.updateOtp(user)
                    if(users[0].affectedRows) {
                        res.status(200).json({
                            error:false,
                            data:"otp sent to your registered mobile number",
                        })
                    } else {
                        res.status(400).json({
                            error:false,
                            data:"Something went wrong",
                        })
                    }
                } else {
                    const user = new User({
                        mobile:req.body.mobile,
                        otp,
                    });
                    const users = await User.signup(user)
                    if(users[0].affectedRows) {
                        res.status(200).json({
                            error:false,
                            data:"otp sent to your registered mobile number",
                        })
                    } else {
                        res.status(400).json({
                            error:false,
                            data:"Something went wrong",
                        })
                    }
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            error:true,
            message:error.message,
        })
    }
};
exports.verifyOtp = async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).send({
                message: "Body can not be empty!"
            });
        }
        const user = new User({
            mobile: req.body.mobile,
            otp:req.body.otp,
        });
        const [users] = await User.login(user);
        if(users.length) {
            const token = jwt.sign({
                username: users[0].username,
                userId: users[0].id,
                email:users[0].email,
                mobile:users[0].mobile,
                time:Date.now(),
            },
                `${process.env.JWT_KEY}`
            );
            res.status(200).json({
                error:false,
                data:{
                    users:users[0],
                    token
                },
            })
        } else {
            return res.status(401).json({
                message: "Auth failed",
                error:true,
            });
        }
    } catch (error) {
        console.log("error",error);
        res.status(400).json({
            error:true,
            message:error.message,
        })
    }
};

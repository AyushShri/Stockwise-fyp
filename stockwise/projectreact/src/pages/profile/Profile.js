import { Button, Grid, styled, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import './Profile.css';
import axios from "axios";

export default function Profile(props) {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = useState(null);
    const [mobileNumber, setMobileNumber] = useState(null)
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState("");
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const AuthStr = 'Bearer '.concat(localStorage.getItem("id_token"));
        axios.get(`http://localhost:5000/api/v1/profile/getProfile`,  {headers: { Authorization: AuthStr }})
        .then(function (response) {
          console.log(response.data.data)
          if(response.status === 200){
            console.log(response)
            setName(response?.data?.data?.username)
            setMobileNumber(response?.data?.data?.mobile)
            setEmail(response?.data?.data?.email)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }, [])

    const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText("#6495ed"),
        backgroundColor: "#6495ed",
        '&:hover': {
          backgroundColor: "#6495ed",
        },
        width: '50%',
        marginLeft: '25%'
      }));

    const handleClick = () => {
        console.log(password);
        if(name === "" || name === null) {
            setError("Name should not be empty");
        } else if(password === "" || password === null) {
            setError("Password should not be empty");
        } else if(email === "" || email === null) {
            setError("email should not be empty");
        } else {
            setError("");
            handleClose()
            const AuthStr = 'Bearer '.concat(localStorage.getItem("id_token"));
            axios.post(`http://localhost:5000/api/v1/profile/updateProfile`,  {
                "username":name,
                "password":password,
                "email":email
            },{headers: { Authorization: AuthStr }})
            .then(function (response) {
            if(response.status === 201){
                console.log(response)
            }
            })
            .catch(function (error) {
            console.log(error);
            });
        }
    }

    return (
        <div className="body">
            <div className="header" />
            <div className="card">
                <Grid container>
                    <Grid item xs={12}>
                        <img src="https://img.icons8.com/color/48/000000/circled-user-male-skin-type-4--v1.png"
                            height={"100px"} width="100Px" className="img" />
                    </Grid>
                    <Grid item xs={12}>
                        <div className="edit-container">
                            <Typography variant="body2" className="center-text" onClick={handleOpen}>
                                Edit Profile
                            </Typography>
                            <img src="https://img.icons8.com/nolan/64/edit--v1.png" height={"20px"} width="20Px" className="edit-icon" />
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" >
                            Name
                        </Typography>
                    </Grid>
                    <Grid item xs={6} className="right-side">
                        <Typography variant="body1" >
                            {name !== null ? name : ""}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" >
                            Mobile Number
                        </Typography>
                    </Grid>
                    <Grid item xs={6} className="right-side">
                        <Typography variant="body1" >
                            {mobileNumber !== null ? mobileNumber : ""}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">
                            email
                        </Typography>
                    </Grid>
                    <Grid item xs={6} className="right-side">
                        <Typography variant="body1">
                            {email !== null ? email : "" }
                        </Typography>
                    </Grid>
                </Grid>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="box">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h3" className="modal-heading">
                                Edit Profile
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField 
                            value={name}
                            id="outlined-basic" 
                            label="Name" 
                            variant="outlined" 
                            className="input"
                            onChange={event => setName(event.target.value)} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField 
                            value={email}
                            id="outlined-basic" 
                            label="Email" 
                            variant="outlined" 
                            className="input"
                            onChange={event => setEmail(event.target.value)} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField 
                            value={password}
                            id="outlined-basic" 
                            label="Password" 
                            variant="outlined" 
                            className="input"
                            onChange={event => setPassword(event.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <ColorButton variant="contained" className="button" onClick={() => handleClick()}>
                            <Typography variant="body1" className="button-text">
                            Save
                        </Typography>
                            </ColorButton>
                        </Grid>
                    </Grid>
                    <p className="errorMessage">{error}</p>
                </div>
            </Modal>
        </div >)
}

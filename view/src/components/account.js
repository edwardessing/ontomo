import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  CircularProgress,
  Card,
  CardActions,
  CardContent,
  Divider,
  Button,
  Grid,
  TextField,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import axios from 'axios';
import { authMiddleWare } from '../util/auth';

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  root: {},
  details: {
    display: 'flex',
  },
  avatar: {
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0,
  },
  locationText: {
    paddingLeft: '15px',
  },
  buttonProperty: {
    position: 'absolute',
    top: '50%',
  },
  uiProgess: {
    position: 'fixed',
    zIndex: '1000',
    height: '31px',
    width: '31px',
    left: '50%',
    top: '35%',
  },
  progess: {
    position: 'absolute',
  },
  uploadButton: {
    marginLeft: '8px',
    margin: theme.spacing(1),
  },
  customError: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 10,
  },
  submitButton: {
    marginTop: '10px',
  },
}));

const Account = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    username: '',
    country: '',
    profilePicture: '',
  });
  const [uiLoading, setUiLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    authMiddleWare(navigate);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get('/user')
      .then((response) => {
        setUser((prevUser) => ({
          ...prevUser,
          firstName: response.data.userCredentials.firstName,
          lastName: response.data.userCredentials.lastName,
          email: response.data.userCredentials.email,
          phoneNumber: response.data.userCredentials.phoneNumber,
          country: response.data.userCredentials.country,
          username: response.data.userCredentials.username,
        }));
        setUiLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate('/login');
        } else {
          console.log(error);
          setUiLoading(false);
        }
      });
  }, [navigate]);

  const handleChange = (event) => {
    setUser((prevUser) => ({
      ...prevUser,
      [event.target.name]: event.target.value,
    }));
  };

  const handleImageChange = (event) => {
    setUser((prevUser) => ({
      ...prevUser,
      image: event.target.files[0],
    }));
  };

  const profilePictureHandler = (event) => {
    event.preventDefault();
    setUiLoading(true);
    authMiddleWare(navigate);
    const authToken = localStorage.getItem('AuthToken');
    let form_data = new FormData();
    form_data.append('image', user.image);
    form_data.append('content', user.content);
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .post('/user/image', form_data, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate('/login');
        } else {
          console.log(error);
          setUiLoading(false);
          setImageError('Error in posting the data');
        }
      });
  };

  const updateFormValues = (event) => {
    event.preventDefault();
    setButtonLoading(true);
    authMiddleWare(navigate);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    const formRequest = {
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
    };
    axios
      .post('/user', formRequest)
      .then(() => {
        setButtonLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate('/login');
        } else {
          console.log(error);
          setButtonLoading(false);
        }
      });
  };

  if (uiLoading) {
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
      </main>
    );
  }

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Card className={clsx(classes.root, classes)}>
        <CardContent>
          <div className={classes.details}>
            <div>
              <Typography className={classes.locationText} gutterBottom variant="h4">
                {user.firstName} {user.lastName}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                type="submit"
                size="small"
                startIcon={<CloudUploadIcon />}
                className={classes.uploadButton}
                onClick={profilePictureHandler}
              >
                Upload Photo
              </Button>
              <input type="file" onChange={handleImageChange} />

              {imageError ? (
                <div className={classes.customError}>
                  Wrong Image Format || Supported Format are PNG and JPG
                </div>
              ) : null}
            </div>
          </div>
          <div className={classes.progress} />
        </CardContent>
        <Divider />
      </Card>

      <br />
      <Card className={clsx(classes.root, classes)}>
        <form autoComplete="off" noValidate>
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="First name"
                  margin="dense"
                  name="firstName"
                  variant="outlined"
                  value={user.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Last name"
                  margin="dense"
                  name="lastName"
                  variant="outlined"
                  value={user.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  margin="dense"
                  name="email"
                  variant="outlined"
                  disabled
                  value={user.email}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  margin="dense"
                  name="phoneNumber"
                  variant="outlined"
                  value={user.phoneNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  margin="dense"
                  name="username"
                  variant="outlined"
                  disabled
                  value={user.username}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Country"
                  margin="dense"
                  name="country"
                  variant="outlined"
                  value={user.country}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              className={classes.submitButton}
              color="primary"
              variant="contained"
              type="submit"
              disabled={buttonLoading}
              onClick={updateFormValues}
            >
              Save details
            </Button>
            {buttonLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </CardActions>
        </form>
      </Card>
    </main>
  );
};

export default Account;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Account from '../components/account';
import Meeting from '../components/meeting';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import Avatar from '@material-ui/core/Avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';

import { authMiddleWare } from '../util/auth';
import { makeStyles } from '@material-ui/core/styles';

import '../newStyle.css';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  avatar: {
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0,
    marginTop: 20
  },
  uiProgress: {
    position: 'fixed',
    zIndex: '1000',
    height: '31px',
    width: '31px',
    left: '50%',
    top: '35%'
  },
  toolbar: theme.mixins.toolbar
}));

const Home = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [render, setRender] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [uiLoading, setUiLoading] = useState(true);

  const loadAccountPage = () => {
    setRender(true);
  };

  const loadMeetingPage = () => {
    setRender(false);
  };

  const logoutHandler = () => {
    localStorage.removeItem('AuthToken');
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        const response = await axios.get('/user');
        const userCredentials = response.data.userCredentials;
        
        authMiddleWare(navigate);
        setSchoolName(userCredentials.schoolName);
        setProfilePicture(userCredentials.imageUrl);
        setUiLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate('/login');
        } else {
          console.log(error);
          // handle other errors
        }
      }
    };
  
    fetchData();
  }, [navigate]);

  if (uiLoading === true) {
    return (
      <div className={classes.root}>
        {uiLoading && <CircularProgress size={150} className={classes.uiProgress} />}
      </div>
    );
  } else {
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              Ontomo
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          <Divider />
          <center>
            <Avatar src={profilePicture} className={classes.avatar} variant="square" />
            <p>
              {schoolName}
            </p>
          </center>
          <Divider />
          <List>
            <ListItem button key="Meeting" onClick={loadMeetingPage}>
              <ListItemIcon>
                <NotesIcon />
              </ListItemIcon>
              <ListItemText primary="Meeting" />
            </ListItem>
            <ListItem button key="Account" onClick={loadAccountPage}>
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary="Account" />
            </ListItem>
            <ListItem button key="Logout" onClick={logoutHandler}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Drawer>
        <div>{render ? <Account /> : <Meeting />}</div>
      </div>
    );
  }
};

export default Home;

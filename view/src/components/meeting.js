import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { DialogTitle, DialogContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  submitButton: {
    display: 'block',
    color: 'white',
    textAlign: 'center',
    position: 'absolute',
    top: 14,
    right: 10
  },
  floatingButton: {
    position: 'fixed',
    bottom: 0,
    right: 0
  },
  form: {
    width: '98%',
    marginLeft: 13,
    marginTop: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar,
  root: {
    minWidth: 470
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  pos: {
    marginBottom: 9,
    paddingLeft: 9
  },
  uiProgess: {
    position: 'fixed',
    zIndex: '1000',
    height: '31px',
    width: '31px',
    left: '50%',
    top: '35%'
  },
  dialogeStyle: {
    maxWidth: '50%'
  },
  viewRoot: {
    margin: 0,
    width: '600px',
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Meeting = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [user, setUser] = useState('')
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [errors, setErrors] = useState([]);
  const [open, setOpen] = useState(false);
  const [uiLoading, setUiLoading] = useState(true);
  const [buttonType, setButtonType] = useState('');
  const [viewOpen, setViewOpen] = useState(false);
  const [deletingMeetingId, setDeletingMeetingId] = useState(null);

  dayjs.extend(relativeTime);

  const handleChange = (event) => {
    if (event.target.name === 'title') {
      setTitle(event.target.value);
    } else if (event.target.name === 'link') {
      setLink(event.target.value);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };

        const responseMeetings = await axios.get('/meetings');
        const responseUser = await axios.get('/user');

        setMeetings(responseMeetings.data);
        setUser(responseUser.data.userCredentials);

        setUiLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const deleteMeetingHandler = async (data) => {
    authMiddleWare(navigate);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    const meetingId = data.meeting.meetingId;

    try {
      await axios.delete(`meeting/${meetingId}`);
      // Fetch the updated data and update the state
      const response = await axios.get('/meetings');
      setMeetings(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setDeletingMeetingId(null);
    }
  };

  const handleEditClickOpen = (data) => {
    setTitle(data.meeting.title);
    setLink(data.meeting.link);
    setMeetingId(data.meeting.meetingId);
    setButtonType('Edit');
    setOpen(true);
  };

  const handleViewOpen = (data) => {
    setTitle(data.meeting.title);
    setLink(data.meeting.link);
    setViewOpen(true);
  };

  const handleClickOpen = () => {
    setMeetingId('');
    setTitle('');
    setLink('');
    setButtonType('');
    setOpen(true);
  };

  const handleSubmit = async (event) => {
    authMiddleWare(navigate);
    event.preventDefault();
    const link = (await axios.post('create-room')).data.roomUrl

    const userMeeting = {
      title: title,
      link: link
    };
    let options = {};
    if (buttonType === 'Edit') {
      options = {
        url: `/meeting/${meetingId}`,
        method: 'put',
        data: userMeeting
      };
    } else {
      options = {
        url: '/meeting',
        method: 'post',
        data: userMeeting
      };
    }
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };

    try {
      await axios(options);
      setOpen(false);
      // Fetch the updated data and update the state
      const response = await axios.get('/meetings');
      setMeetings(response.data);
    } catch (error) {
      setOpen(true);
      setErrors(error.response.data);
      console.log(error);
    }
  };

  const handleViewClose = () => {
    setViewOpen(false);
  };

  const handleClose = (event) => {
    setOpen(false);
  };


  if (uiLoading) {
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
      </main>
    );
  } else {
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <IconButton
          className={classes.floatingButton}
          color="primary"
          aria-label="Add Meeting"
          onClick={handleClickOpen}
        >
          <AddCircleIcon style={{ fontSize: 60 }} />
        </IconButton>

        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {buttonType === 'Edit' ? 'Edit Meeting' : 'Create a new Meeting'}
              </Typography>
              <Button autoFocus color="inherit" onClick={handleSubmit} className={classes.submitButton}>
                {buttonType === 'Edit' ? 'Save' : 'Submit'}
              </Button>
            </Toolbar>
          </AppBar>

          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="meetingTitle"
                  label="Meeting Title"
                  name="title"
                  autoComplete="meetingTitle"
                  helperText={errors.title}
                  value={title}
                  error={errors.title ? true : false}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="meetingDetails"
                  label="Meeting Details"
                  name="link"
                  autoComplete="meetingDetails"
                  multiline
                  helperText={errors.link}
                  error={errors.link ? true : false}
                  onChange={handleChange}
                  value={link}
                />
              </Grid>
            </Grid>
          </form>
        </Dialog>
        <Grid container spacing={2}>
          {meetings.map((meeting) => (
            <Grid item xs={12} key={meeting.meetingId}>
              <Card variant="outlined">
                <CardContent>
                  <Button style={{textTransform: 'none'}} href={meeting.link} size="large" color="primary" startIcon={<OpenInNewIcon fontSize="small"/>}>
                    Open {meeting.title} 
                  </Button>
                  <Typography className={classes.pos} color="textSecondary">
                    {dayjs(meeting.createdAt).fromNow()}
                  </Typography>
                  <Typography className={classes.pos} variant="body2">
                    Created by: {meeting.email}
                  </Typography>
                </CardContent>
                <CardActions>
                  {/* <Button
                    size="small"
                    color="primary"
                    onClick={() => handleViewOpen({ meeting })}
                  >
                    View
                  </Button> */}
                  <Button
                    size="small"
                    color="primary"
                    disabled={user.email !== meeting.email}
                    onClick={() => handleEditClickOpen({ meeting })}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    disabled={user.email !== meeting.email}
                    onClick={() => deleteMeetingHandler({ meeting })}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog
          onClose={handleViewClose}
          aria-labelledby="customized-dialog-title"
          open={viewOpen}
          fullWidth
          classes={{ paperFullWidth: classes.dialogeStyle }}
        >
          <DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
            {title}
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              id="meetingDetails"
              name="link"
              multiline
              readOnly
              value={link}
              InputProps={{
                disableUnderline: true
              }}
            />
          </DialogContent>
        </Dialog>
      </main>
    );
  }
}

export default Meeting;

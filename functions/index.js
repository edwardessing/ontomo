const functions = require('firebase-functions');
const express = require('express');
const auth = require('./util/auth');

const app = express();


// meetings
const {
    getAllMeetings,
    postOneMeeting,
    deleteMeeting,
    editMeeting
} = require('./api/meetings')


// users
const {
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails
} = require('./api/users')


// meeting routes
app.get('/meetings', auth, getAllMeetings);
app.post('/meeting', auth, postOneMeeting);
app.delete('/meeting/:meetingId', auth, deleteMeeting);
app.put('/meeting/:meetingId', auth, editMeeting);


// user routes
app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);


exports.api = functions.https.onRequest(app);
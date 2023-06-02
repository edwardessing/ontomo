const { db } = require('../util/admin');

exports.getAllMeetings = (request, response) => {
	db
		.collection('meetings')
    .where('username', '==', request.user.username)
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let meetings = [];
			data.forEach((doc) => {
				meetings.push({
                    meetingId: doc.id,
                    title: doc.data().title,
					body: doc.data().body,
					createdAt: doc.data().createdAt,
				});
			});
			return response.json(meetings);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};


exports.postOneMeeting = (request, response) => {
	if (request.body.link.trim() === '') {
		return response.status(400).json({ body: 'Must not be empty' });
    }
    
    if(request.body.title.trim() === '') {
        return response.status(400).json({ title: 'Must not be empty' });
    }
    
    const newMeetingItem = {
        title: request.body.title,
        link: request.body.link,
        username: request.user.username,
        createdAt: new Date().toISOString()
    }
    db
        .collection('meetings')
        .add(newMeetingItem)
        .then((doc)=>{
            const responseMeetingItem = newMeetingItem;
            responseMeetingItem.id = doc.id;
            return response.json(responseMeetingItem);
        })
        .catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
};


exports.deleteMeeting = (request, response) => {
  const document = db.doc(`/meetings/${request.params.meetingId}`);
  document
      .get()
      .then((doc) => {
          if (!doc.exists) {
              return response.status(404).json({ 
                  error: 'Meeting not found' 
          })}
          if(doc.data().username !== request.user.username){
              return response.status(403).json({error:"UnAuthorized"})
          }
          return document.delete();
      })
      .then(() => {
          response.json({ message: 'Delete successfull' });
      })
      .catch((err) => {
          console.error(err);
          return response.status(500).json({ 
              error: err.code 
          });
      });
};


exports.editMeeting = ( request, response ) => { 
  if(request.body.meetingId || request.body.createdAt){
      response.status(403).json({message: 'Not allowed to edit'});
  }
  let document = db.collection('meetings').doc(`${request.params.meetingId}`);
  document.update(request.body)
  .then(()=> {
      response.json({message: 'Updated successfully'});
  })
  .catch((err) => {
      console.error(err);
      return response.status(500).json({ 
              error: err.code 
      });
  });
};
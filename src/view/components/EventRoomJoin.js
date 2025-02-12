import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {query,collection,orderBy,onSnapshot,doc,setDoc,addDoc, serverTimestamp, increment,updateDoc, FieldPath, getDoc} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase-config';

export default function EventRoomCreate({openJoin,setOpenJoin,eventCard,setChatRoom,eventRoom}) {
    const navigate=useNavigate();
    const user=getAuth().currentUser


  const handleClose = () => {
    setOpenJoin(false);
  };

  const updatePax= async ()=>{
    const roomRef=doc(db,'aRooms/'+eventRoom+'/eRooms',eventCard.eventID)
    const docSnap=await getDoc(roomRef)
    if (!docSnap.exists()){
    await setDoc(doc(db, eventCard.path+'/users',user.email), { //use Reference?
      userRef: doc(db,'users',user.email),
      role: 'member'
    });
    await setDoc(doc(db,'users/'+user.email+'/joinedRooms',roomRef.id),{
      roomRef:roomRef
    })
    await updateDoc(roomRef,{
      pax: increment(1),
      rem: increment(-1)
    })}
    else{
      console.log('already in')
    }
  };

  return (
    <div>
        {(eventCard)?
      <Dialog open={openJoin} onClose={handleClose}>
        
        <DialogTitle>Join Room: {eventCard.name}</DialogTitle>
        <DialogContent>
        <Stack spacing={1.5} sx={{minWidth:'300px'}}>
          <DialogContentText>
            Location: {eventCard.location}
          </DialogContentText>
          
          <DialogContentText>
            Date: {eventCard.date}
          </DialogContentText>

          <DialogContentText>
            Time: {eventCard.time}
          </DialogContentText>

          <DialogContentText>
            Pax/Capacity : {eventCard.pax}/{eventCard.cap}
          </DialogContentText>
      
      </Stack>
        </DialogContent>
        <DialogActions>
          {(eventCard.cap-eventCard.pax>0)?
            <Button onClick={()=>{updatePax();setChatRoom(eventCard.path);localStorage.setItem('chatRoom',eventCard.path);navigate('/home/chatroom')}}>Join</Button>:
            <Button disabled onClick={()=>{setChatRoom(eventCard.path);localStorage.setItem('chatRoom',eventCard.path);navigate('/home/chatroom')}}>Join</Button>
          }
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>:<div></div>}
    </div>
  );
}
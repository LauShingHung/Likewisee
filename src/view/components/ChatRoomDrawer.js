import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PlaceIcon from '@mui/icons-material/Place';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { collection, getDocs,getDoc, deleteDoc,doc, updateDoc, increment} from 'firebase/firestore';
import { db } from '../../firebase-config';
import {useNavigate } from 'react-router-dom';

const TemporaryDrawer=({roomDate,roomTime,roomLocation,roomPax,roomCap})=> {
  const navigate=useNavigate();

  const [state, setState] = React.useState({
    right: false
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleDelete = async () =>{
    const eventRoom=localStorage.getItem('eventRoom')
    const chatRoom=localStorage.getItem('chatRoom')
    const chatRoomKey=chatRoom.split('/').slice(-1)[0]
    const chatRoomUsers=collection(db,chatRoom+'/users')
    const chatRoomUsersSnapshot=await getDocs(chatRoomUsers)
    const chatRoomMessages=collection(db,chatRoom+'/messages')
    const chatRoomMessagesSnapshot=await getDocs(chatRoomMessages)
    console.log(chatRoom)
    chatRoomUsersSnapshot.forEach( (document)=>{
      console.log('users/'+document.id+'/joinedRooms',chatRoomKey)
      deleteDoc(doc(db,'users/'+document.id+'/joinedRooms',chatRoomKey))
      deleteDoc(doc(db,chatRoom+'/users',document.id))
    })
    chatRoomMessagesSnapshot.forEach( (document)=>{
      deleteDoc(doc(db,chatRoom+'/messages',document.id))
    })
    deleteDoc(doc(db,'aRooms/'+eventRoom+'/eRooms',chatRoomKey))
    await updateDoc(doc(db,'aRooms',eventRoom),{
      cap:increment(-1)
    })
    navigate('/home/MyRooms')
  }

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClose={toggleDrawer(anchor, false)}
    >
      <List>
      <ListItemText primary='Event Details:' sx={{marginLeft:'10px'}}/>
        <ListItem key='Date'>
            <ListItemIcon>
                <CalendarMonthIcon/>
            </ListItemIcon>
            <ListItemText primary='Date' secondary={roomDate}/> {/*put date text here*/}
        </ListItem>
        <ListItem key='Time'>
            <ListItemIcon>
                <ScheduleIcon/>
            </ListItemIcon>
            <ListItemText primary='Time' secondary={roomTime}/> {/*put time text here*/}
        </ListItem>
        <ListItem key='Location'>
            <ListItemIcon>
                <PlaceIcon/>
            </ListItemIcon>
            <ListItemText primary='Location' secondary={roomLocation}/> {/*put location text here*/}
        </ListItem>
      </List>
      <Divider />
      <List>
      <ListItemText sx={{marginLeft:'10px'}}>Attendees ({roomPax}/{roomCap}) :</ListItemText>
      <ListItem>
            <ListItemIcon>
                <ManIcon sx={{fill:'#ffad01'}}/>
            </ListItemIcon>
            <ListItemText primary='Andrei (Owner)'/> 
        </ListItem>
        <ListItem>
            <ListItemIcon>
                <WomanIcon/>
            </ListItemIcon>
            <ListItemText primary='Ann'/> 
        </ListItem>
        <ListItem >
        <Button  variant="outlined"sx={{
          bgcolor:'#E22727',
          color:'white',
                      ':hover': {
                        bgcolor: '#D50000', // theme.palette.primary.main
                        color: 'white'
                      },
                    }}
                    onClick={handleDelete}>Delete</Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      {
        <React.Fragment key={'right'}>
            <IconButton
            size="large"
            aria-label="menu"
            
            onClick={toggleDrawer('right', true)} 
          >
            <MenuIcon/>
          </IconButton>
          <Drawer
            anchor={'right'}
            open={state['right']}
            onClose={toggleDrawer('right', false)}
          >
            {list('right')}
          </Drawer>
        </React.Fragment>
}
    </div>
  );
}

export default TemporaryDrawer
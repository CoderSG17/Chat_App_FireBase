import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { toggleMessagesPane } from '../../utils';
import { useAuth } from '../Context/Auth';
import { useState } from 'react';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { RxAvatar } from "react-icons/rx";
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MediaDrawer from "../components/MediaDrawer"
import {useNavigate} from 'react-router-dom'


export default function MessagesPaneHeader() {
  const { funUser, chatId, isReceiverBlocked, isCurrUserBlocked, changeBlockStatus, userData } = useAuth()
  
  const online = Date.now() - userData?.lastSeen <=10001

  const [open, setOpen] = useState();
  const [showMedia, setShowMedia] = useState();
  const openRef = React.useRef(null);


  const navigate = useNavigate()

  const handleBlock = async () => {
    if (!funUser) return;
    const userDocRef = doc(db, "users", userData.id)
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(funUser.id) : arrayUnion(funUser.id)
      });
      changeBlockStatus();
    } catch (error) {
      console.log(error)
    }

  }

  const handleClickOutside = (e) => {
    if (openRef.current && !openRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const userName = userData.name.split(" ")
  .join("");




  return (
    <>
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.body',
      }}
      py={{ xs: 2, md: 2 }}
      px={{ xs: 1, md: 2 }}
    >
      <Stack direction="row" spacing={{ xs: 1, md: 2 }} alignItems="center">
        <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{
            display: { xs: 'inline-flex', sm: 'none' },
          }}
          onClick={() => toggleMessagesPane()}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        {funUser?.avatar ? <Avatar size="lg" src={funUser?.avatar} alt={"error"} />:<RxAvatar className='icon1'></RxAvatar>}
        <div>
          <Typography
            fontWeight="lg"
            fontSize="lg"
            component="h2"
            noWrap
          endDecorator={
            online ? (
              <Chip
                variant="outlined"
                size="sm"
                color="neutral"
                sx={{
                  // borderRadius: 'sm',
                }}
                startDecorator={
                  <CircleIcon sx={{ fontSize: 8 }} color="success" />
                }
                slotProps={{ root: { component: 'span' } }}
              >
                Online
              </Chip>
            ) : <Chip
                variant="outlined"
                size="sm"
                color="neutral"
                sx={{
                  // borderRadius: 'sm',
                }}
                startDecorator={
                  <CircleIcon sx={{ fontSize: 8 }} color="danger" />
                }
                slotProps={{ root: { component: 'span' } }}
              >
                Offline
              </Chip>
          }
          >
            {funUser?.name ? funUser?.name :"lorem ipsum"}
          </Typography>
          <Typography level="body-sm">{funUser?.email?funUser?.email:"lorem ipsum "}</Typography>
        </div>
      </Stack>
      <Stack spacing={1} direction="row" alignItems="center">
        <Button
          startDecorator={<PhoneInTalkRoundedIcon /> }
          color="neutral"
          variant="outlined"
          size="sm"
          sx={{
            display: { xs: 'none', md: 'inline-flex' },
          }}
          onClick={()=>navigate(`/room/${userName}`)}
        >
          Video/Audio Call
        </Button>
        <IconButton size="sm" variant="plain" color="neutral" onClick={() => setOpen(!open)}>
          <MoreVertRoundedIcon />
        </IconButton>
        {open ?
          <div className='button-container' ref={openRef}>
        

            <button className='btn2' style={{backgroundColor:"blue"}} onClick={()=>{setShowMedia(!showMedia)
            setOpen(false)}}>Media</button>
          
            <button className='btn2' onClick={handleBlock}>{isCurrUserBlocked ? "You are blocked!!" : isReceiverBlocked ? "User Blocked!!" : "Block User"}</button>
          </div>
          : ""}
      </Stack>
    </Stack>
    {showMedia && <MediaDrawer onClose={() => setShowMedia(false)} />}
      </>
  );
}

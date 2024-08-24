import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, Divider } from '@mui/material';
import { toast } from 'react-toastify';
import { signOut } from "firebase/auth";
import { auth } from './firebase';
import { useAuth } from '../Context/Auth';
import { NavLink } from 'react-router-dom';


const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const Profile = ({setToggleDrawer}) => {

  const {userData} = useAuth();
  
  const logout = () => {
    signOut(auth);
    toast.success("Logout Successfull !")
    setTimeout(() => {

      navigate("/login")
    },2000)
    setToggleDrawer(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Avatar
          // onClick={toggleDrawer(anchor, true)}
          style={{
            height: "100px",
            width: "100px",
            marginLeft: 15,
            cursor: "pointer",
            backgroundColor: "#EEBC1D",
          }}
        src={userData?.avatar}
        alt={"user image"}
        />
      </Box>
      <Divider></Divider>
      <Box sx={{ minWidth: 275, height: "330px", marginTop: "50px", display: 'flex', justifyContent: 'center', alignItems: "centre", border: "1px solid red " }}>
        <Card variant="text" style={{ border: "1px solid red ", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "350px" }}><React.Fragment>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Name : {userData?.name}
            </Typography>
            <Typography variant="h5" component="div">
              Email: {userData?.email}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Phone: {userData?.phone?userData.phone:"Phone Number not provided"}
            </Typography>
            <Typography variant="body2">
             About: {userData?.about?userData?.about:"About not provided"}
              <br />
              {/* {'"a benevolent smile"'} */}
            </Typography>
          </CardContent>
          <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
            <NavLink to='/updateProfile'> 
            <Button size="small" variant='contained' color="success" >Edit Profile</Button>
            </NavLink>
            <Button size="small" variant='contained' color="error" onClick={logout}>Logout</Button>
          </CardActions>
        </React.Fragment></Card>
      </Box>
    </>

  );
}

export default Profile
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


const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const About = ({setToggleDrawer}) => {
  
  const logout = () => {
    signOut(auth);
    toast.success("Logout Successfull !")
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
        // src={user.photoURL}
        // alt={user.displayName || user.email}
        />
      </Box>
      <Divider></Divider>
      <Box sx={{ minWidth: 275, height: "330px", marginTop: "50px", display: 'flex', justifyContent: 'center', alignItems: "centre", border: "1px solid red " }}>
        <Card variant="text" style={{ border: "1px solid red ", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "300px" }}><React.Fragment>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Word of the Day
            </Typography>
            <Typography variant="h5" component="div">
              be{bull}nev{bull}o{bull}lent
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              adjective
            </Typography>
            <Typography variant="body2">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
            <Button size="small" variant='contained' color="error" onClick={logout}>Logout</Button>
          </CardActions>
        </React.Fragment></Card>
      </Box>
    </>

  );
}

export default About
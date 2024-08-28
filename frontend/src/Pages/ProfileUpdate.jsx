import React from 'react'
import { Grid, TextField, Button, Typography, Avatar, Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Navbar from '../components/Navbar';
import { useAuth } from '../Context/Auth';
import { useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import upload from '../components/upload';
import { toast } from 'react-toastify';
const Input = styled('input')({
  display: 'none',
});

const ProfileUpdate = () => {

    const {userData,user} = useAuth();
    console.log(userData);
    const [userDet , setUserDet] = useState(true)

    const [profileDet , setProfileDet] = useState({
        avatar:"",
        name:"",
        email:"",
        about:"",
        phone:"",
        file:null,
        url:""
    })
    
    if (userDet && userData) {
        setProfileDet({
           avatar:userData.avatar,
        name:userData.name,
        email:userData.email,
        about:userData.about,
        phone:userData.phone,
        file:null,
        url:""
        });
        setUserDet(false);
    }


    const handleInput =(e)=>{
        let {name,value ,type,  files} = e.target;
        if (type === 'file') {
            if (files && files[0]) {
                setProfileDet(prevDet => ({
                ...prevDet,
                file: files[0],
                url: URL.createObjectURL(files[0])
              }));
            }
          } else{

            setProfileDet(prevDet => ({
                ...prevDet,
                [name]: value
              }));
          }
    }


    const handleSubmit=async()=>{
        try {
            const docRef = doc(db,"users",user.uid)
            console.log(docRef);
            let imgUrl;
            if(profileDet.file){
            imgUrl = await upload(profileDet.file)
            }

            if (!profileDet.url) {
              toast.error("Image is required");
              return;
            }
      
            if (!profileDet.name) {
              toast.error("Name is required");
              return;
            } else if (profileDet.name.length < 3) {
              toast.error("Name should be at least 3 characters long");
              return;
            }
      
      
            if (!profileDet.about) {
             toast.error("About is required")
             return;
            }
            else if((profileDet.about.length < 2)){
              toast.error("About should be at least 2 characters long");
              return;
            }
      
            const phoneRegex = /^[6-9]\d{9}$/;
      
            if (!profileDet.phone) {
             toast.error("Phone Number is required")
             return
            }
            else if (!phoneRegex.test(profileDet.phone)) {
              toast.error("Phone No. should be exactly 10 digits long and start with 6, 7, 8, or 9");
              return;
            }

            
            await updateDoc(docRef,{
                    avatar:imgUrl?imgUrl:profileDet.avatar,
                    name:profileDet.name,
                    email:profileDet.email,
                    about:profileDet.about,
                    phone:profileDet.phone,
            })

            toast.success('Profile updated successfully')
        } catch (error) {
            console.log(error)
        }
       
        
    }

  return (
    <>
    <Navbar></Navbar>
         <Paper elevation={3} style={{ padding: '2rem', maxWidth: '500px', margin: '120px auto 50px auto'  , borderRadius:"20px"}}>
      <Typography variant="h4" align="center" gutterBottom style={{textDecoration:"underline" , fontWeight:"700"}}>
        Update Profile
      </Typography>

      <Grid container spacing={2} justifyContent="center" alignItems='center' flexDirection="column">
        <Grid item>
          <Avatar alt="Uploaded Image" src={profileDet.url ? profileDet.url :profileDet.avatar} sx={{ width: 100, height: 100 }} />
        </Grid>
        <Grid item>
          <label htmlFor="upload-image">
            <Input accept="image/*" id="upload-image" type="file" onChange={handleInput}
            />
            <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
              Upload an Image
            </Button>
          </label>
        </Grid>
      </Grid>

      <Box component="form" sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
          <label className='label'>Name</label>

            <TextField
              fullWidth
              variant="outlined"
              name='name'
              type='text'
              value={profileDet.name}
              onChange={handleInput}
            />
          </Grid>
          <Grid item xs={12}>
          <label className='label'>Email</label>

            <TextField
              fullWidth
              
              variant="outlined"
              type="email"
              name="email"
              value={profileDet.email}
              onChange={handleInput}
            />
          </Grid>
          <Grid item xs={12}>
          <label className='label'>Phone</label>
<br />
            <TextField
              fullWidth
              
              variant="outlined"
              type="number"
              name='phone'
              value={profileDet.phone}
              onChange={handleInput}
            />
          </Grid>
          <Grid item xs={12}>
          <label className='label'>About</label>
            <TextField
              fullWidth
              
              variant="outlined"
              multiline
              rows={4}
              type='text'
              name='about'
              value={profileDet.about}
              onChange={handleInput}
            />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
              Submit 
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
    </>
  )
}

export default ProfileUpdate
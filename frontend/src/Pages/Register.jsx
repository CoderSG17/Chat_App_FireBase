import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { auth, db } from '../components/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc , doc } from 'firebase/firestore';
import upload from '../components/upload';
const defaultTheme = createTheme();

const Register = () => {

  const navigate = useNavigate();


  const api = `https://api.multiavatar.com/4645646/${Math.round(Math.random() * 1000)}.png`;

  const [avatar,setAvatar] = useState(api)

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    about: "",
    phone: "",
    file: null,
    url: "",
    promotion:"no",
    status:"false"
  })


  const triggerFileInput = () => {
    document.getElementById('file-input').click();
  };

  const handleInput = (e) => {
    const { name, value, type, checked, files } = e.target;
  
    if (type === 'file') {
      if (files && files[0]) {
        setUserDetails(prevDetails => ({
          ...prevDetails,
          file: files[0],
          url: URL.createObjectURL(files[0])
        }));
      }
    } else {
      const newVal = type === 'checkbox' ? (checked ? 'yes' : 'no') : value;
  
      setUserDetails(prevDetails => ({
        ...prevDetails,
        [name]: newVal
      }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      if (!userDetails.url) {
        toast.error("Image is required");
        return;
      }

      if (!userDetails.name) {
        toast.error("Name is required");
        return;
      } else if (userDetails.name.length < 3) {
        toast.error("Name should be at least 3 characters long");
        return;
      }


      if (!userDetails.about) {
       toast.error("About is required")
       return;
      }
      else if((userDetails.about.length < 2)){
        toast.error("About should be at least 2 characters long");
        return;
      }

      const phoneRegex = /^[6-9]\d{9}$/;

      if (!userDetails.phone) {
       toast.error("Phone Number is required")
       return
      }
      else if (!phoneRegex.test(userDetails.phone)) {
        toast.error("Phone No. should be exactly 10 digits long and start with 6, 7, 8, or 9");
        return;
      }
      
  

      const result = await createUserWithEmailAndPassword(
        auth,
        userDetails.email,
        userDetails.password
      );
      console.log(result)

      const imgUrl = await upload(userDetails.file)

      await setDoc(doc(db, 'users', result.user.uid), {
        id: result.user.uid,
        name: userDetails.name,
        email: userDetails.email,
        about: userDetails.about,
        phone: userDetails.phone,
        promotion: userDetails.promotion,
        avatar:imgUrl,
        blocked: []
      });
  
      await setDoc(doc(db, 'userchats', result.user.uid), {
        chats: []
      });

      setUserDetails({
        name: "",
        email: "",
        password: "",
        about: "",
        phone: "",
        promotion: ""
      })

      toast.success('Registration successful')

      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (error) {
      console.log(error)

      let errorMessage = '';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email address  already exist.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid Email Address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak. It should be of atleast 6 characters';
          break;
        case 'auth/missing-password':
          errorMessage = 'Please enter the password';
          break;
        default:
          errorMessage = 'An error occurred during registration.';
      }

      toast.error(errorMessage);
      return;
    }

  };



  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Navbar></Navbar>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 8
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
              <Grid item xs={12}>
                <h3 style={{textDecoration:"underline"}}>Upload Photo</h3>
                <div style={{border:"1px solid grey" , borderRadius:"5px" , padding:"5px"}}>
                  <div onClick={triggerFileInput} style={{ cursor: 'pointer', textAlign: 'center' }}>
                    <img
                      src={userDetails.url || avatar}
                      alt="Avatar"
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #ccc'
                      }}
                    />
                  </div>
                  <input
                    type="file"
                    id="file-input"
                    accept="image/*"
                    onChange={handleInput}
                    style={{ display: 'none' }}
                    required
                  />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="name"
                    required
                    fullWidth
                    id="Name"
                    label=" Name"
                    autoFocus
                    value={userDetails.name}
                    onChange={handleInput}
                    type='text'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    type='email'
                    onChange={handleInput}
                    value={userDetails.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    id="password"
                    onChange={handleInput}
                    value={userDetails.password}
                    type='password'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="about"
                    label="About"
                    id="about"
                    autoComplete="about"
                    onChange={handleInput}
                    value={userDetails.about}
                    type='text'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="phone"
                    label="Phone"
                    type="number"
                    id="phone"
                    autoComplete="new-phone"
                    onChange={handleInput}
                    value={userDetails.phone}

                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox color="primary"
                      onChange={handleInput}
                      type="checkbox" value={userDetails.promotion} name='promotion' checked={userDetails.promotion === "yes"} />}
                    label="I want to receive inspiration, marketing promotions and updates via email." name='promotion'
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <NavLink to="/login" variant="body2">
                    Already have an account? LogIn
                  </NavLink>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default Register
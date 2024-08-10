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
import { auth } from '../components/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";

const defaultTheme = createTheme();

const Register=()=> {

  const navigate = useNavigate();

  
  const [userDetails, setUserDetails ] = useState({
    name:"",
    email:"",
    password:"",
    about:"",
    phone:"",
    promotion:""
  })

  const handleInput =(e)=>{
    const {name,value,type, checked, } = e.target
    const newVal = type === "checkbox" ? (checked ? "yes" : "no") : value;

    setUserDetails({
      ...userDetails,
      [name]:newVal
    })
    
  }


  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        userDetails.email,
        userDetails.password
      );
      console.log(result)

      setUserDetails({
        name:"",
        email:"",
        password:"",
        about:"",
        phone:"",
        promotion:""
      })
    

     toast.success('Registration successful')

     setTimeout(() => {
      navigate('/login')
    },2000)

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
            marginBottom:8
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

export default  Register
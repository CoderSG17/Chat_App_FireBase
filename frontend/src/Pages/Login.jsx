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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../components/firebase';


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const Login=()=> {

    const navigate = useNavigate();

  const [userCredentials, setuserCredentials ] = useState({
    email:"",
    password:"",
    save:""
  })

    const handleInput=(e)=>{
      const {name,value,type, checked, } = e.target
      const newVal = type === "checkbox" ? (checked ? "yes" : "no") : value;
  
      setuserCredentials({
        ...userCredentials,
        [name]:newVal
      })
    }

  const handleSubmit = async(e) => {
   e.preventDefault();
   if (!userCredentials.email || !userCredentials.password) {
   toast.error("Please fill all the Fields")
    return;
  }

  try {
    const result = await signInWithEmailAndPassword(auth, userCredentials.email , userCredentials.password);

  toast.success(`Sign Up Successful. Welcome ${result.user.email}` )

  setTimeout(() => {
    navigate('/')
  },2000)

  } catch (error) {
    console.log(error)

    let errorMessage = '';

    switch (error.code) {
      case 'auth/invalid-credential':
        errorMessage = 'Invalid credentials';
        break;
    }
    toast.error(errorMessage); 

    return;
  }
  };



  return (
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
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              type='email'
              onChange={handleInput}
              value={userCredentials.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleInput}
              value={userCredentials.password}

            />
            <FormControlLabel
              control={<Checkbox color="primary" 
                onChange={handleInput} checked={userCredentials.save==="yes"}
                value={userCredentials.save} type='checkbox' name='save'
              />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <NavLink to="forgotPassword" variant="body2">
                  Forgot password?
                </NavLink> */}
              </Grid>
              <Grid item>
                <NavLink to="/register" variant="body2">
                  {"Don't have an account? Register"} 
                </NavLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login
import React from 'react';
import {AppBar,Toolbar,IconButton,Badge,MenuItem,Menu,Typography } from '@material-ui/core';
import StorefrontIcon from '@material-ui/icons/Storefront';
import useStyles from './styles';
import logo from '../../assets/logo.png'
import {Link,useLocation} from 'react-router-dom'

const Navbar = ({ totalItems }) => {
    const classes = useStyles();
    const location = useLocation();
  return (
    <>
        <AppBar position="fixed" className={classes.appBar} color="inherit">
            <Toolbar>
                <Typography component={Link} to="/" variant="h6" className={classes.title} color="inherit">
                    <img src={logo} alt="logo" height="60px" className={classes.image}/>
                    My Book-Shop
                </Typography>
                <div className={classes.grow}/>
                {location.pathname === '/' && (
                <div className={classes.button}>
                <IconButton component={Link} to="/cart" aria-lable="Show cart items" color="inherit">
                    <Badge badgeContent={totalItems} color="secondary">
                        <StorefrontIcon/>
                    </Badge>
                </IconButton>
                </div> )} 
            </Toolbar>
        </AppBar>
    </>
  );
}
export default Navbar
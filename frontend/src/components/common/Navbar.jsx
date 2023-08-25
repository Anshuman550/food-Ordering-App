import * as React from 'react';
import { useState, useEffect } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import {MdOutlineRestaurantMenu } from 'react-icons/md';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Swal from 'sweetalert2';
import axios from 'axios';

import images from '../../constants/images';
import { user_is_authenticated, user_logout, user_type } from '../../lib/auth';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {

  const [wallet, setWallet] = useState(0);

  const matches = useMediaQuery('(min-width:480px)');

  useEffect(() => {
      if (user_type() === 'buyer') {
          axios
              .get('http://localhost:5000/api/buyers/details', {
                  headers: {
                      authorization: localStorage.getItem('token')
                  }
              })
              .then(res => {
                  setWallet(res.data.wallet);
              })
              .catch(err => {
                  console.log(err);
              });
      }
  }, []);
  const handleLogout = () => {
    user_logout();
    Swal.fire({
        title: 'Success',
        text: 'You have successfully logged out!',
        icon: 'success',
        confirmButtonText: 'OK'
    })
        .then(() => {
            window.location.href = '/';
        });
}

  const [toggleMenu, setToggleMenu] = React.useState(false);
  return (
  <nav className='app__navbar'>
    <div className='app__navbar-logo'>
      <Link to = "/"> <img src = {images.foodle} alt = "app logo" /> </Link>
    </div>


{user_is_authenticated() ?
                        <div>
                          <ul className='app__navbar-links'>
                            <li className='p__opensans'> <Link to = "/orders"> <ShoppingCartIcon style={{ marginRight: "0.5rem" }} /> Orders </Link></li>
                            
                            {user_type() === 'vendor' ?
                                <li className='p__opensans'> <Link to = "/statistics"><EqualizerIcon style={{ marginRight: "0.5rem" }} /> Statistics </Link></li>
                                :
                                <li className='p__opensans'> <AccountBalanceWalletIcon style={{ marginRight: "0.5rem" }} />Wallet: Rs. {wallet}</li>
                            }
                            <li className='p__opensans'> <Link to = "/profile"><PersonIcon style={{ marginRight: "0.5rem" }} /> Profile </Link></li>
                            <li className='p__opensans' onClick={handleLogout}><ExitToAppIcon style={{ marginRight: "0.5rem" }} />Logout</li>
                          </ul>
                            
                        </div>
                        :
                        <div>
                          <ul className='app__navbar-links'>
                            <li className='p__opensans'> <Link to = "/login"><LoginIcon style={{ marginRight: "0.5rem" }} /> Login </Link></li>
                            <li className='p__opensans'> <Link to = "/register"><AppRegistrationIcon style={{ marginRight: "0.5rem" }} /> Register </Link></li>
                          </ul>
                           
                        </div>
  }


    <div className='app__navbar-smallscreen'>
      <GiHamburgerMenu color = "#fff" fontSize={27} onClick = {() => setToggleMenu(true)}/>
      {toggleMenu && (
      <div className='app__navbar-smallscreen_overlay flex__center slide-bottom'>
        <MdOutlineRestaurantMenu fontSize={27} className='overlay__close' onClick = {() => setToggleMenu(false)}/>
        {user_is_authenticated() ?
                        <div>
                          <ul className='app__navbar-smallscreen_links'>
                            <li className='p__opensans'> <Link to = "/orders"><ShoppingCartIcon style={{ marginRight: "0.5rem" }} /> Orders </Link></li>
                            {/* <li className='p__opensans'> <FavoriteIcon style={{ marginRight: "0.5rem" }} /><Link to = "/wishlist"> Wishlist </Link></li> */}
                            {user_type() === 'vendor' ?
                                <li className='p__opensans'> <Link to = "/statistics"><EqualizerIcon style={{ marginRight: "0.5rem" }} /> Statistics </Link></li>
                                :
                                <li className='p__opensans'> <AccountBalanceWalletIcon style={{ marginRight: "0.5rem" }} />Wallet: Rs. {wallet}</li>
                            }
                            <li className='p__opensans'> <Link to = "/profile"><PersonIcon style={{ marginRight: "0.5rem" }} /> Profile </Link></li>
                            <li className='p__opensans' onClick={handleLogout}><ExitToAppIcon style={{ marginRight: "0.5rem" }} />Logout</li>
                          </ul>
                            
                        </div>
                        :
                        <div>
                          <ul className='app__navbar-smallscreen_links'>
                            <li className='p__opensans'> <Link to = "/login"> <LoginIcon style={{ marginRight: "0.5rem" }} /> Login </Link></li>
                            <li className='p__opensans'> <Link to = "/register"><AppRegistrationIcon style={{ marginRight: "0.5rem" }} /> Register </Link></li>
                          </ul>
                            
                        </div>
                    }
      </div>
  )}
    </div>
  </nav>
)
}

export default Navbar;

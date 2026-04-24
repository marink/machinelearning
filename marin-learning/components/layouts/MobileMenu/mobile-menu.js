
import Link from "next/link";

import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem  from '@material-ui/core/MenuItem';
import NotificationsIcon from '@material-ui/icons/Notifications';

import Badge from '@material-ui/core/Badge';
import HomeIcon from '@material-ui/icons/Home';

import BookIcon from '@material-ui/icons/MenuBook';
import AboutIcon from '@material-ui/icons/InfoOutlined';
import { Typography } from "@material-ui/core";

export default (props) => {

    return (
        <Menu
                anchorEl={props.anchorElement}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                id={props.id}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={props.open}
                onClose={props.onMobileMenuToggle}>

            <MenuItem>
                <Link href="/">
                    <Typography component="p">
                        <IconButton aria-label="Machine Learning JS Home" color="inherit">
                            <HomeIcon />
                        </IconButton>
                        Home
                    </Typography>
                </Link>
            </MenuItem>
            <MenuItem>
                <Link href="/docs">
                    <Typography>
                        <IconButton aria-label="Machine Learning JS Documentation" color="inherit">
                            <BookIcon />
                        </IconButton>
                        Documentation
                    </Typography>
                </Link>
            </MenuItem>
            <MenuItem>
                <Link href="/about">
                    <Typography>
                        <IconButton aria-label="About Machine Learning JS" color="inherit">
                            <AboutIcon />
                        </IconButton>
                        About
                    </Typography>
                </Link>
            </MenuItem>

        {(false) ? (
            <>
        <MenuItem>
          <IconButton aria-label="show 11 new notifications" color="inherit">
            <Badge badgeContent={21} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={props.onClick}>
          <IconButton
                  aria-label="account of current user"
                  aria-controls="primary-search-account-menu"
                  aria-haspopup="true"
                  color="inherit">

              <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
        </>
        ) : undefined }
      </Menu>

  );
}

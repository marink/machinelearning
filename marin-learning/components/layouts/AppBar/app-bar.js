import React from 'react';

import { fade, makeStyles } from '@material-ui/core/styles';

import Link from 'next/link'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import MenuOpenIcon from "@material-ui/icons/MenuOpen";

const useStyles = makeStyles(theme => ({

    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),

        backgroundImage: "url('../static/header.png')"
    },

    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 0, 0, 2),
    },

    grow: {
        flexGrow: 1,
    },

    menuButton: {
        marginRight: 16
    },

    title: {
        color: "white",
        textDecoration: "none",
        display: 'block',
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            textAlign: "center",
        },
    },

    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },

    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    inputRoot: {
        color: 'inherit',
    },

    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },

    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
            marginRight: theme.spacing(2)
        },
    },

    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },

    siteLink: {
        fontWeight: 100,
        fontSize: 12,
        fontWeight: 500,
        color: "rgba(222,222,222,0.8)",
        textDecoration: "none",
        margin: theme.spacing(2),
    }
}));

export default ({
    isDrawerOpen,
    onDrawerToggle,
    menuId,
    onProfileMenuToggle,
    mobileMenuId,
    onMobileMenuToggle
}) => {

    const classes = useStyles();
    return (
        <AppBar position="fixed" elevation={2} className={classes.appBar}>
            <Toolbar className={classes.toolbar} variant="dense">
                <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={onDrawerToggle}
                        edge="start" className={classes.menuButton}>

                    {isDrawerOpen ? <MenuOpenIcon /> : <MenuIcon />}

                </IconButton>

                <Link href="/">
                    <a className={classes.title}>
                        <Typography variant="h6" noWrap>
                            MachineLearning.js
                        </Typography>
                    </a>
                </Link>

                { (false) ? (
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}>
                    </InputBase>
                </div>
                ) : undefined}

                <div className={classes.grow} />

                <div className={classes.sectionDesktop}>

                    <Typography noWrap>
                        <Link href="/docs">
                            <a className={classes.siteLink}>
                                Docs
                            </a>
                        </Link>
                        <Link href="/about">
                            <a className={classes.siteLink}>
                                About
                            </a>
                        </Link>
                    </Typography>

                { (false) ? (
                    <>
                    <IconButton aria-label="show 4 new mails" color="inherit">
                        <Badge badgeContent={4} color="secondary">
                            <MailIcon />
                        </Badge>
                    </IconButton>
                    <IconButton aria-label="show 17 new notifications" color="inherit">
                        <Badge badgeContent={17} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={onProfileMenuToggle}
                            color="inherit">

                        <AccountCircle />
                    </IconButton>
                    </>
                ) : undefined}
                </div>

                <div className={classes.sectionMobile}>
                    <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={onMobileMenuToggle}
                            color="inherit">
                        <MoreIcon />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
}

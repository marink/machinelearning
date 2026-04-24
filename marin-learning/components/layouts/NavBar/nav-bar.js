import React from 'react';

import { fade, makeStyles } from '@material-ui/core/styles';

import Link from 'next/link'
import MuiLink from '@material-ui/core/Link';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
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
    root: {
        display: 'flex',
    },

    headerBar: {
        margin: "0 auto",
        zIndex: theme.zIndex.drawer + 1,
        borderBottom: "thin solid lightgray",
        backgroundColor: "rgba(250, 250, 250, 0.5)",
        backdropFilter: "saturate(180%) blur(20px)",
        color: "black"
    },

    toolbar: {
        margin: "0 auto",
        width: "100%",
        maxWidth: 980,
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 0, 0, 2),
    },

    grow: {
        flexGrow: 1,
    },

    title: {
        color: "black",
        textDecoration: "none",
        fontWeight: 500,
        display: 'block'
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
            paddingRight: theme.spacing(4)
        },
    },
    sectionMobile: {
        display: 'flex',
        paddingRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none'
        },
    },
    header: {
        width: "100%",
        position: "fixed",
        alignItems: "center"
    },

    siteLink: {
        fontSize: 12,
        fontWeight: 500,
        color: "rgba(44,44,44,0.8)",
        margin: theme.spacing(2),
        textDecoration: "none"
    }
}));

export default (props) => {

    const classes = useStyles();
    return (
        <AppBar position="fixed" className={classes.headerBar} elevation={0}>
            <Toolbar className={classes.toolbar} variant="dense">
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
                        <Link href="/">
                            <a className={classes.siteLink}>
                                Home
                            </a>
                        </Link>
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
                </div>

                <div className={classes.sectionMobile}>
                    <IconButton
                            aria-label="show more"
                            aria-controls={props.mobileMenuId}
                            aria-haspopup="true"
                            onClick={props.onMobileMenuToggle}
                            color="inherit">
                        <MoreIcon />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
}

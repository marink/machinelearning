
import React, { useContext } from "react";

import clsx from 'clsx';
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import BookIcon from '@material-ui/icons/MenuBook';
import AboutIcon from '@material-ui/icons/InfoOutlined';

export const drawerWidth = 240;

const useStyles = makeStyles(theme => ({

    hide: {
        display: 'none',
    },

    drawer: {
        whiteSpace: 'nowrap',
    },

    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        zIndex: 0
    },

    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },

    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    }
}));

let state = {
    open: false
};

export const MenuDrawerCtx = React.createContext(state);

export default (props) => {

    const classes = useStyles();

    return (
        <MenuDrawerCtx.Provider value={{open: false}}>
            <Drawer
                variant={props.isDesktop ? "permanent" : "temporary"}
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: props.open,
                    [classes.drawerClose]: !props.open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: props.open,
                        [classes.drawerClose]: !props.open,
                    }),
                }}
                open={props.open}>

                {
                    (!props.isDesktop) ? (
                        <div className={classes.toolbar}>
                            <IconButton onClick={props.onDrawerToggle}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                    ) : (undefined)
                }

                <Divider />

                <div className={classes.toolbar} />

                {props.children}

                <Divider />

                <List>
                    <Link href="/docs">
                        <ListItem button key="Documentation">
                            <ListItemIcon><BookIcon /></ListItemIcon>
                            <ListItemText primary="Documentation" />
                        </ListItem>
                    </Link>

                    <Link href="/about">
                        <ListItem button key="About">
                            <ListItemIcon><AboutIcon /></ListItemIcon>
                            <ListItemText primary="About" />
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
        </MenuDrawerCtx.Provider>
    );
};

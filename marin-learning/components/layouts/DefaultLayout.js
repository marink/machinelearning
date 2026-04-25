import React, { useState, useContext } from 'react';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from "@material-ui/core/Paper";

import MenuDrawer, {drawerWidth, useMenuDrawerControls} from "./MenuDrawer";
import MobileMenu from "./MobileMenu";
import ToolbarMenu from "./ToolbarMenu";
import AppBar from "./AppBar";


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },

    content: {
        flexGrow: 1,
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(6),
        width: "calc(100vw - " + drawerWidth + "px)"
    }
}));

export default ({children, sidebarMenu, onDrawerToggle}) => {

    const classes = useStyles();

    const isDesktop = useMediaQuery(
        useTheme().breakpoints.up('sm'), {
            defaultMatches: true
        });

    const [isOpen, handleMenuDrawerToggle] = useMenuDrawerControls();

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    function handleDrawerToggle() {
        handleMenuDrawerToggle();
        onDrawerToggle({drawerWidth, isOpen});
    }

    function handleProfileMenuOpen(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleMobileMenuClose() {
        setMobileMoreAnchorEl(null);
    }

    function handleMenuClose() {
        setAnchorEl(null);
        handleMobileMenuClose();
    }

    function handleMobileMenuOpen(event) {
        setMobileMoreAnchorEl(event.currentTarget);
    }

    const menuId = 'primary-search-account-menu';
    const mobileMenuId = 'primary-search-account-menu-mobile';

    return (
        <Paper
                elevation={0}
                className={classes.root}>

            <AppBar onDrawerToggle={handleDrawerToggle}
                    isDrawerOpen={isOpen}
                    menuId={menuId}
                    mobileMenuId={mobileMenuId}
                    onProfileMenuToggle={handleProfileMenuOpen}
                    onMobileMenuToggle={handleMobileMenuOpen}>
            </AppBar>

            <MobileMenu id={mobileMenuId}
                    anchorElement={mobileMoreAnchorEl}
                    open={isMobileMenuOpen}
                    onClick={handleProfileMenuOpen}>
            </MobileMenu>

            <ToolbarMenu id={menuId}
                    anchorElement={anchorEl}
                    open={isMenuOpen}
                    onClose={handleMenuClose}>
            </ToolbarMenu>

            <MenuDrawer
                    drawerWidth={drawerWidth}
                    isDesktop={isDesktop}
                    onDrawerToggle={handleDrawerToggle}
                    open={isOpen}>

                {sidebarMenu}
            </MenuDrawer>

            <main className={classes.content}>
              {children}
            </main>
        </Paper>
    );
}

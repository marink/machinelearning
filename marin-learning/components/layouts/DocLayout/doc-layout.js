import {useState} from 'react';
import Paper from "@material-ui/core/Paper";

import MobileMenu from "../MobileMenu";
import ToolbarMenu from "../ToolbarMenu";
import NavBar from "../NavBar";

import { ThemeProvider } from '@material-ui/core/styles';
import { docLayoutTheme, useStyles } from "./doc-layout-styles";

const drawerWidth = 240;


export default ({children}) => {

    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);


    function handleDrawerToggle() {
        setOpen(!open);
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

        <ThemeProvider theme={docLayoutTheme}>
            <Paper
                elevation={0}
                className={classes.root}>

            <NavBar onDrawerToggle={handleDrawerToggle}
                    isDrawerOpen={open}
                    menuId={menuId}
                    mobileMenuId={mobileMenuId}
                    onProfileMenuToggle={handleProfileMenuOpen}
                    onMobileMenuToggle={handleMobileMenuOpen}>

            </NavBar>

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

            <main className={classes.content}>
                <div className={classes.toolbar} />

                <div className={classes.pageContent}>
                    {children}
                </div>
            </main>
        </Paper>
        </ThemeProvider>

    );
}

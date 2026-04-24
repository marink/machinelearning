import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Close from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

function TabPanel(props) {
    const { value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}>

        </Typography>
    );
}

TabPanel.propTypes = {
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(tabId) {
    return {
        id: `scrollable-auto-tab-${tabId}`,
        'aria-controls': `scrollable-auto-tabpanel-${tabId}`,
    };
}

const useStyles = makeStyles(theme => ({

    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        position: "fixed",
        width: "100%"
    },

    tabs: {
        minHeight: "unset",
        width: props => "calc(100vw - " + props.leftMargin + "px)"
    },

    tabStyles: {
        minHeight: "unset",
        textTransform: "none",
    },

    closeButton: {
        marginTop: theme.spacing(0.4),
        marginLeft: theme.spacing(1),
        fontSize: 14,
        fontWeight: 500,
        '&:hover': {
            background: "lightgray",
            borderRadius: "50%"
        }
    },
    splitButton: {
        width: "100%"
    }
}));

const EditorTab = ({tabName, closeButtonStyle }) => {
    return (
        <div style={{display: "flex"}}>
            <div style={{ fontSize: "inherit",
                    whiteSpace: "nowrap", maxWidth: 160,
                    overflow: "hidden", textOverflow: "ellipsis"
                }}>

                {tabName}
            </div>

            <Close button-type="close" className={closeButtonStyle}/>
        </div>
    )
}

export default function ({ value, leftMargin, tabs, onTabClose, onTabChange }) {

    const classes = useStyles({leftMargin});

    const tabList = tabs.map((tab, index) =>
        <Tab key={"tab-key-" + index} label={
                <EditorTab tabName={tab.name}
                    closeButtonStyle={classes.closeButton} />
            }

            value={tab.name}

            className={classes.tabStyles}
            {...a11yProps(tab.name)} />
    );

    const handleChange = (event, selectedTab) => {

        let eventType = event.target.getAttribute("button-type");

        if (eventType === "close") {
            console.log("Closed tab", selectedTab);
            onTabClose(selectedTab);
            return undefined;
        }

        onTabChange(selectedTab);

        console.log("Selected Tab", selectedTab);
    };

    console.log("VALUE IS:", value);

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs   value={value}
                        onChange={handleChange}
                        className={classes.tabs}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="relations navigation tabs">

                  {tabList}

                </Tabs>
            </AppBar>
        </div>
    );
}

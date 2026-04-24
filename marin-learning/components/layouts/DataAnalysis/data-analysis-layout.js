
import {useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import OpenFileIcon from '@material-ui/icons/OpenInBrowserTwoTone';

import {useRelationsContainer} from "./relations-container";
import ConfirmationDialog, {Selection} from "./confirmation-dialog";

import { withRedux } from "~/state/redux";

import Layout from '../DefaultLayout';
import FileLoader from "~/components/FileLoader";
import SidebarMenu from "~/nav/sidebar-menu";
import DataRelationTabs from "../DataTabs";

import RelationEditor from '~/components/RelationEditor';

import {loadFromArff} from "~/data";


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },

    content: {
        flexGrow: 1,
        padding: theme.spacing(4)
    }
}));

const DataAnalysisLayout = ({children, relationName}) => {

    const [leftMargin, setLeftMargin] = useState(100);

    const [open, setOpen] = useState(false);

    const [editRelation, setEditRelation] = useState();
    const [relations, addRelation, removeRelation, pendingLoads, ignoreLoad] = useRelationsContainer();

    console.log("Pending loads", pendingLoads);

    const classes = useStyles();

    function handleDrawerToggle({isOpen, drawerWidth}) {
        setLeftMargin((isOpen) ? 100 : drawerWidth);
    }

    function handleClickOpen() {
        console.log("Handle Open is clicked");
        setOpen(true);
    };

    function handleClose() {
        console.log("Handle Close is clickeds");
        setOpen(false);
    };

    function handleLoadConfirmation(selection) {
        switch (selection) {
            case Selection.IGNORE: {
                ignoreLoad(pendingLoads[0].name);
            } break;

            case Selection.IGNORE_ALL: {
                while (pendingLoads.length > 0) {
                    ignoreLoad(pendingLoads[0].name);
                }
            } break;

            case Selection.REVERT: {
                addRelation(pendingLoads[0].name, true);
            } break;

            case Selection.REVERT_ALL: {
                while (pendingLoads.length > 0) {
                    addRelation(pendingLoads[0].name, true);
                }
            } break;
        }
    };
    // DLG END


    function handleCloseTab(tab) {

        let tabIndex = relations.findIndex(t => t.name === tab);
        console.log("Deleting relation:", tab, "with index:", tabIndex);
        const tabList = relations.slice();
        tabList.splice(tabIndex, 1);
        if (tab === editRelation.name) {
            if (tabIndex >= tabList.length) { tabIndex--; }
            console.log("setting tab to:", tabList[tabIndex]);
            setEditRelation((tabIndex < 0) ? false : tabList[tabIndex])
        }

        removeRelation(tab);

        console.log("Deleted tab", tab);
    };

    function handleTabChange(tabName) {
        const tab = relations.find(t => t.name == tabName);
        setEditRelation(tab);
        console.log("Relations list", relations);
        console.log("Selected tab", tab);
    }

    function handleFileLoad(file, data) {

        console.log("Received data ***", file.name);

        const relation = loadFromArff(data);

        console.log("Relation loaded", relation);

        addRelation(relation);
        setEditRelation(relation);
    }

    let menuItems = [
        {
            "text": "Load File",
            "icon": (<OpenFileIcon />),
            "onClick": handleClickOpen
        },
        {
            "text": "Documentation",
            "icon": (<InboxIcon />),
            "onClick": handleClickOpen
        }
    ];

    return (
        <Layout
                sidebarMenu={<SidebarMenu menuItems={menuItems} />}
                onDrawerToggle={handleDrawerToggle}>

            <DataRelationTabs
                    value={(editRelation) ? editRelation.name : false}
                    tabs={relations}
                    onTabClose={handleCloseTab}
                    onTabChange={handleTabChange}
                    leftMargin={leftMargin}>
            </DataRelationTabs>

            <RelationEditor children={children} editRelation={editRelation}></RelationEditor>

            <ConfirmationDialog
                classes={{ paper: classes.paper}}
                keepMounted
                open={pendingLoads.length > 0}
                onClose={handleLoadConfirmation}
                value={(pendingLoads.length > 0) ? pendingLoads[0].name : undefined} />


            <FileLoader open={open} onCancel={handleClose} onFileLoad={handleFileLoad} />
        </Layout>
    )
}

export default withRedux(DataAnalysisLayout);

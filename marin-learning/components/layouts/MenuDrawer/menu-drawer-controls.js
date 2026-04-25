
import {useState, useContext} from "react";
import {MenuDrawerCtx} from "./menu-drawer";

let open = false;

function toggleStatus() {
    open = (!open);
    console.log("OPEN status changed to: ", open);
}

function isOpen() {
    return open
}

export function useMenuDrawerControls1() {

    let state = useContext(MenuDrawerCtx);

    console.log("MenuDrawer context state:", state);

    return state;
}


export function useMenuDrawerControls() {

    const [open, setStatus] = useState(false);

    function toggleStatus1() {
        setStatus(!open);
    }

    return [open, toggleStatus1];
}

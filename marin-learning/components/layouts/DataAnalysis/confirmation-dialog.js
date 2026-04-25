import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

export const Selection = {
    IGNORE: "ignore",
    IGNORE_ALL: "ignore all",
    REVERT: "revert",
    REVERT_ALL: "revert all"
}

export default (props) => {
    const { onClose, value, open, ...other } = props;

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={open}
            {...other}
        >
            <DialogTitle id="confirmation-dialog-title">Confirm Data Load</DialogTitle>
            <DialogContent dividers>
                Warning: relation {value} already exists.
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => onClose(Selection.IGNORE)} color="primary">
                    Ignore
                </Button>
                <Button onClick={() => onClose(Selection.IGNORE_ALL)} color="primary">
                    Ignore All
                </Button>
                <Button onClick={() => onClose(Selection.REVERT)} color="primary">
                    Revert
                </Button>
                <Button onClick={() => onClose(Selection.REVERT_ALL)} color="primary">
                    Revert All
                </Button>
            </DialogActions>
        </Dialog>
    );
}

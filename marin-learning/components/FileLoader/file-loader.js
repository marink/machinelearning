import React, { useCallback, useMemo, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { useDropzone } from 'react-dropzone';

import LoadFileIcon from '@material-ui/icons/OpenInBrowserOutlined';

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
});

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const iconStyle = {
    fontSize: 50
}

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const FileDropzone = ({onLoad, onAcceptFiles}) => {

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {

        acceptedFiles.forEach(file => {
            const reader = new FileReader();

            reader.onabort = () => {
                console.log('File reading was aborted');
            };

            reader.onerror = () => {
                console.log('File reading has failed');
            };

            reader.onload = () => {
                console.log("Loading file:", file.name);
                onLoad(file, reader.result);
            }

            reader.readAsText(file);
        });

        rejectedFiles.forEach(file => {
            console.log("Cannot accept file:", file.name);
        });

        if (acceptedFiles.length > 0) {
            onAcceptFiles(acceptedFiles);
        }

    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: ".arff",
        onDrop
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [isDragActive, isDragReject]);

    return (
        <div className="container">
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />

                <LoadFileIcon className="iconStyle"/>

                <Typography paragraph>
                    Drag &amp; Drop the <tt>.arff </tt>files here,<br />
                    or click to browse in your local hard drive.
                </Typography>
            </div>
        </div>
    );
}

const DialogTitle = withStyles(styles)(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                        aria-label="close"
                        className={classes.closeButton}
                        onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default ({open, onFileLoad, onCancel}) => {

    return (
        <div>
            <Dialog aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={onCancel}>
                    ARFF File Upload
                </DialogTitle>
                <DialogContent dividers>

                    <FileDropzone onLoad={onFileLoad} onAcceptFiles={onCancel} />

                    <Typography gutterBottom>
                        The file will be automatically loaded in the application.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

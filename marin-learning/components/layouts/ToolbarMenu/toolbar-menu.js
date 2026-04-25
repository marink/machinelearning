import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

export default (props) => {
    return (
        <Menu anchorEl={props.anchorElement}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                id={props.id}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={props.open}
                onClose={props.onClose}>

            <MenuItem onClick={props.onClose}>Profile</MenuItem>
            <MenuItem onClick={props.onClose}>My account</MenuItem>
        </Menu>
      );
}

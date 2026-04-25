

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

export default ({menuItems}) => {
    return (
        <List>
        {(menuItems) ? (
                menuItems.map((menuItem) => (
                    <ListItem button key={menuItem.text} onClick={menuItem.onClick}>
                        <ListItemIcon>{menuItem.icon}</ListItemIcon>
                        <ListItemText primary={menuItem.text} />
                    </ListItem>
                ))
        ) : undefined}
        </List>
    );
};

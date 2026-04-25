

import {createMuiTheme, makeStyles} from '@material-ui/core/styles';

const docLayoutTheme = createMuiTheme({

    overrides: {
        MuiTypography: {
            h1: {
                fontSize: 42,
                lineHeight: 1,
                fontWeight: 600,
                letterSpacing: "0em",
                paddingBottom: 16
            },

            h2: {
                fontSize: 32,
                lineHeight: 1,
                fontWeight: 600,
                letterSpacing: "0em",
                paddingBottom: 8
            },

            h3: {
                fontSize: 24,
                lineHeight: 1,
                fontWeight: 600,
                letterSpacing: "0em",
                paddingBottom: 6
            },

            paragraph: {
                fontSize: 20
            },

        }
    }
});

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },

    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },

    typical: {
        fontSize: 8
    },

    content: {
        flexGrow: 1,
        margin: "0 auto",
        padding: theme.spacing(3),
        width: "100%",
        maxWidth: 980
    }
}));

export {docLayoutTheme, useStyles};

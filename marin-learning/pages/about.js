import React from 'react'
import clsx from 'clsx';
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Layout from '../components/layouts/DocLayout';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useStyles } from '../components/layouts/DocLayout/doc-layout-styles';

import useMediaQuery from '@material-ui/core/useMediaQuery';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';

const useCardStyles = makeStyles(theme => ({

    card: {
        maxWidth: 345,
        width: 260,
        boxShadow: "1px 4px 8px 0px rgba(0,0,0,0.2)",
        borderRadius: 0
    },

    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },

    paper: {
        padding: theme.spacing(2)
    },

    expandOpen: {
        transform: 'rotate(180deg)',
    },
}));


export default () => {

    const isDesktop = useMediaQuery(useTheme().breakpoints.up('sm'), {
        defaultMatches: true
    });

    const imgJustify = (isDesktop) ? "flex-end" : "center";

    const classes = useStyles();
    const cardClasses = useCardStyles();

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Layout>
            <Typography variant="h1">About</Typography>
            <Typography paragraph>
                This site is intended to serve as a common resource for Machine Learning algorithms, which are implemented in the
                Javascript language and run in a Web browser.
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography paragraph></Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Grid container direction="row" justify={imgJustify} alignItems="flex-start">
                        <Paper className={cardClasses.paper} elevation={0}>
                            <Card className={cardClasses.card}>
                                <CardActionArea>
                                    <CardMedia component="img" image="/static/images/weka-book-cover-4e.jpg"
                                        title="Data Mining: Practical Machine Learning Tools and Technique"/>
                                    <CardContent>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            Copyright (c) Elsevier Publications <br/>
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Typography>
                                        <Link size="small" color="primary"
                                            href="https://www.cs.waikato.ac.nz/~ml/weka/book.html">
                                            Book Web Site
                                        </Link>
                                    </Typography>
                                    <IconButton
                                            className={clsx(cardClasses.expand, {
                                                [cardClasses.expandOpen]: expanded,
                                            })}
                                            onClick={handleExpandClick}
                                            aria-expanded={expanded}
                                            aria-label="show more">
                                            <ExpandMoreIcon />
                                    </IconButton>
                                </CardActions>
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <Typography variant="h3">Features:</Typography>
                                        <Typography className={classes.typical} >
                                            Explains how machine learning algorithms for data mining work.
                                        </Typography>
                                        <Typography paragraph>
                                            Helps you compare and evaluate the results of different techniques.
                                        </Typography>
                                        <Typography paragraph>
                                            Covers performance improvement techniques, including input preprocessing
                                            and combining output from different methods.
                                        </Typography>
                                        <Typography paragraph>
                                            Features in-depth information on probabilistic models and deep learning.
                                        </Typography>
                                        <Typography paragraph>
                                            Provides an introduction to the Weka machine learning
                                            workbench and links to algorithm implementations in the software.
                                        </Typography>
                                    </CardContent>
                                </Collapse>
                            </Card>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                        <Paper className={cardClasses.paper} elevation={0}>
                            <Typography variant="h2">
                                Data Mining: Practical Machine Learning Tools and Technique
                            </Typography>
                            <Typography paragraph>
                                Most algorithms will be implementations of the techniques described in the book.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography paragraph></Typography>
                </Grid>
            </Grid>

            <Typography paragraph>
                As a result, data analysis tools will be available, which generate useful statistics about the files that are
                uploaded to Web Browser local storage and Indexed DB.
            </Typography>

        </Layout>
    )
}

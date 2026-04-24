
import { useState } from "react";
import {withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import DataTable from "~/components/DataTable";

const AntTabs = withStyles({
    root: {
        borderBottom: '1px solid #e8e8e8',
    },
    indicator: {
        backgroundColor: '#1890ff',
    },
})(Tabs);


const AntTab = withStyles(theme => ({
    root: {
        textTransform: 'none',
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing(4),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
        },
        '&$selected': {
            color: '#1890ff',
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: '#40a9ff',
        },
    },
    selected: {},
}))(props => <Tab disableRipple {...props} />);



// ---

const sample = [
    ['Frozen yoghurt', 159, 6.0, 24, 4.0],
    ['Ice cream sandwich', 237, 9.0, 37, 4.3],
    ['Eclair', 262, 16.0, 24, 6.0],
    ['Cupcake', 305, 3.7, 67, 4.3],
    ['Gingerbread', 356, 16.0, 49, 3.9],
];

function createData(id, dessert, calories, fat, carbs, protein) {
    return { id, dessert, calories, fat, carbs, protein };
}

const rows1 = [];

for (let i = 0; i < 200; i += 1) {
    const randomSelection = sample[Math.floor(Math.random() * sample.length)];
    rows1.push(createData(i, ...randomSelection));
}

const cols = [
    {
        width: 200,
        label: 'Dessert',
        dataKey: 'dessert',
    },
    {
        width: 120,
        label: 'Calories\u00A0(g)',
        dataKey: 'calories',
        numeric: true,
    },
    {
        width: 120,
        label: 'Fat\u00A0(g)',
        dataKey: 'fat',
        numeric: true,
    },
    {
        width: 120,
        label: 'Carbs\u00A0(g)',
        dataKey: 'carbs',
        numeric: true,
    },
    {
        width: 120,
        label: 'Protein\u00A0(g)',
        dataKey: 'protein',
        numeric: true,
    },
];

export default ({ children, editRelation, ...other }) => {


    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const rows = [];
    const columns = [];

    if (editRelation) {

        editRelation.attributes.forEach(a => {
            columns.push({
                width: 128,
                label: a.name,
                dataKey: a.name,
            });
        });

        editRelation.instances.forEach(instance => {
            rows.push(instance);
        });
    }


    return (
        <Box>
            {
                (editRelation) ?
                (<Typography
                        component="div"
                        role="tabpanel"
                        id={`tabpanel-${editRelation.name}`}
                        aria-labelledby={`simple-tab-${editRelation.name}`}
                        {...other}>
                    <Box p={3}>

                        Editing Relation {editRelation.name}!

                        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
                            <AntTab label="Data Analysis" />
                            <AntTab label="Data Table" />
                        </AntTabs>
                        <DataTable
                                rows={rows}
                                columns={columns}>

                        </DataTable>

                    </Box>
                </Typography>)
                : undefined
            }
        </Box>

    );

};

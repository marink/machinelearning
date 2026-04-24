import React from 'react'
import Link from '@material-ui/core/Link';
import Layout from '../components/layouts/DocLayout';

import Typography from "@material-ui/core/Typography";

export default () => {

    return (
        <Layout>

            <Typography variant="h1">Documentation</Typography>

            <Typography paragraph>



            </Typography>

            <Typography variant="h2">Loading Data in ARFF</Typography>

            <Typography paragraph>
                The Atribute-Relation File Format (ARFF) is a text file that has a header with meta-data and
                the actual data that will be processed.

            </Typography>

            <Typography paragraph>
                Check <Link href="https://www.cs.waikato.ac.nz/ml/weka/arff.html">here</Link> for more information.

            </Typography>

            <Typography paragraph>
                This is a text file that has a head April 1st, 2002

An ARFF (Attribute-Relation File Format) file is an ASCII text file that describes a list of instances sharing a set of attributes. ARFF files were developed by the Machine Learning Project at the Department of Computer Science of The University of Waikato for use with the Weka machine learning software. This document descibes the version of ARFF used with Weka versions 3.2 to 3.3; this is an extension of the ARFF format as described in the data mining book written by Ian H. Witten and Eibe Frank (the new additions are string attributes, date attributes, and sparse instances).

This explanation was cobbled together by Gordon Paynter (gordon.paynter at ucr.edu) from the Weka 2.1 ARFF description, email from Len Trigg (lenbok at myrealbox.com) and Eibe Frank (eibe at cs.waikato.ac.nz), and some datasets. It has been edited by Richard Kirkby (rkirkby at cs.waikato.ac.nz). Contact Len if you're interested in seeing the ARFF 3 proposal.

Overview
ARFF files have two distinct sections. The first section is the Header information, which is followed the Data information.

The Header of the ARFF file contains the name of the relation, a list of the attributes (the columns in the data), and their types. An example header on the standard IRIS dataset looks like this:

   % 1. Title: Iris Plants Database
   %
   % 2. Sources:
   %      (a) Creator: R.A. Fisher
   %      (b) Donor: Michael Marshall (MARSHALL%PLU@io.arc.nasa.gov)
   %      (c) Date: July, 1988
   %
   is - versicolor, Iris - virginica}

The Data of the ARFF file looks like the following:

                   @DATA
                   5.1,3.5,1.4,0.2,Iris-setosa
                   4.9,3.0,1.4,0.2,Iris-setosa
                   4.7,3.2,1.3,0.2,Iris-setosa
                   4.6,3.1,1.5,0.2,Iris-setosa
                   5.0,3.6,1.4,0.2,Iris-setosa
                   5.4,3.9,1.7,0.4,Iris-setosa
                   4.6,3.4,1.4,0.3,Iris-setosa
                   5.0,3.4,1.5,0.2,Iris-setosa
                   4.4,2.9,1.4,0.2,Iris-setosa
                   4.9,3.1,1.5,0.1,Iris-er with meta-data and the actual data that will be processed.
                Check <Link href="https://www.cs.waikato.ac.nz/ml/weka/arff.html">here</Link> for more information.

            </Typography>            <Typography variant="h2">ARFF - Atribute-Relation File Format</Typography>

            <Typography paragraph>
                This is a text file that has a header with meta-data and the actual data that will be processed.
                Check <Link href="https://www.cs.waikato.ac.nz/ml/weka/arff.html">here</Link> for more information.

            </Typography>            <Typography variant="h2">ARFF - Atribute-Relation File Format</Typography>

            <Typography paragraph>
                This is a text file that has a header with meta-data and the actual data that will be processed.
                Check <Link href="https://www.cs.waikato.ac.nz/ml/weka/arff.html">here</Link> for more information.

            </Typography>

        </Layout>
    )
};

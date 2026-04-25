


import Link from 'next/link';
import {useRouter} from "next/router";

import Counter from "~/components/Counter";
import Layout from '~/components/layouts/DataAnalysis';

let p1 = 4;
let p2 = 4;
let p = p1 + p2;
export default () => {


    const router = useRouter();

    return (
        <Layout relationName={router.query.relationName}>

            <h1 className="main-title">{p1} + {p2} = {p}</h1>
            <h1 className="main-title">Hi Chloe!</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>
            <h1 className="main-title">aoeuaoe</h1>



            <Counter />


        </Layout>
    )
}

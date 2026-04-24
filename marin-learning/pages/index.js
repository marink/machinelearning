


import Link from 'next/link';

import Counter from "~/components/Counter";
import Layout from '~/components/layouts/DataAnalysis';


function getPosts() {
    return [
        { id: 'hello-nextjs', title: 'Hello Next.js' },
        { id: 'learn-nextjs', title: 'Learn Next.js is awesome' },
        { id: 'deploy-nextjs', title: 'Deploy apps with ZEIT' }
    ];
}

const PostLink = ({ post }) => (
    <li>
        <Link href="/p/[id]" as={`/p/${post.id}`}>
            <a>{post.title}</a>
        </Link>
        <style jsx>{`
      li {
        list-style: none;
        margin: 5px 0;
      }

      a {
        text-decoration: none;
        color: blue;
        font-family: 'Arial';
      }

      a:hover {
        opacity: 0.6;
      }
    `}</style>
    </li>
);

const Home = () => {

    return (
        <Layout>

            <h1 className="main-title">Machine Learning</h1>
            <h2 className="main-subtitle">JavaScript Web Application</h2>

            <ul>
                {getPosts().map(post => (
                    <PostLink key={post.id} post={post} />
                ))}
            </ul>

            <Counter />

            <style jsx>{`
                h1, h2, a {
                    font-family: 'Arial';
                }

                ul {
                    padding: 0;
                }

                li {
                    list-style: none;
                    margin: 5px 0;
                }

                a {
                    text-decoration: none;
                    color: blue;
                }

                a:hover {
                    opacity: 0.6;
                }

                .main-title {
                    margin-bottom: 0;
                }

                .main-subtitle {
                    color: #bebebe;
                    margin-top: 0;
                }
            `}</style>

        </Layout>
    )
}

export default Home;

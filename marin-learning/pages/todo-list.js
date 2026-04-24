
import React, { memo } from 'react';
import Layout from '../components/layouts/DefaultLayout';

import Link from 'next/link'

import { useInputValue, useTodos } from '../components/custom-hooks';


import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';

export default memo(props => {
    const { inputValue, changeInput, clearInput, keyInput } = useInputValue();

    const { todos, addTodo, checkTodo, removeTodo } = useTodos();

    const clearInputAndAddTodo = _ => {
        clearInput();
        addTodo(inputValue);
    };

    return (
        <Layout>
            <Link href='/'>
                <a className='card'>
                    <h3>Home &rarr;</h3>
                    <p>Learn more about Marin Learning.</p>
                </a>
            </Link>

            <AddTodo
                inputValue={inputValue}
                onInputChange={changeInput}
                onButtonClick={clearInputAndAddTodo}
                onInputKeyPress={event => keyInput(event, clearInputAndAddTodo)}
            />
            <TodoList
                items={todos}
                onItemCheck={idx => checkTodo(idx)}
                onItemRemove={idx => removeTodo(idx)}
            />
        </Layout>
    );
});

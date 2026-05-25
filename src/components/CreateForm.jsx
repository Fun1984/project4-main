// import { fetchBooks, formatDate } from '../api.js'
import { useState, useEffect } from 'react'
import Dropdown from './Dropdown'
import InputInfo from './InputInfo'
import CreateImageForm from './CreateImageForm'

function CreateForm({onAddBook}) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');

    return (<>
        <p> Create Form </p>
        <section>
            <h2>새글 작성</h2>
            <InputInfo title={title} setTitle={setTitle}
                       author={author} setAuthor={setAuthor}
                       content={content} setContent={setContent} />
            <hr />
            <CreateImageForm title={title} author={author} content={content} />
        </section>
    </>)
};

export default CreateForm;
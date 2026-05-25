import { useState } from 'react'

function  InputInfo({title, setTitle, author, setAuthor, content, setContent}) {

    return (<>
        <form>
            <h2>제목</h2>
            <input value={title} onChange={(e) => setTitle(e.target.value)}></input>
            <h2>저자</h2>
            <input value={author} onChange={(e) => setAuthor(e.target.value)}></input>
            <h2>내용</h2>
            <input value={content} onChange={(e) => setContent(e.target.value)}></input>
        </form>
    </>)
}

export default InputInfo;
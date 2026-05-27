import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import UpdateForm from '../components/UpdateForm'

export default function Update({ bookURL, onUpdate }) {
  const { id } = useParams()
  console.log("id:", id)
  const navigate = useNavigate()

  //추가된 state
  const [title, setTitle] = useState(null)
  const [author, setAuthor] = useState(null)
  const [content, setContent] = useState(null)

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadBookDetail() {
      try {
        setLoading(true)

        const res = await fetch(`${bookURL}/${id}`)

        if (!res.ok) {
          throw new Error('책 정보를 가져오지 못했습니다.')
        }

        const data = await res.json()
        setBook(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id && bookURL) {
      loadBookDetail()
    }
  }, [id, bookURL])

  const handleSubmit = async (updatedFields) => {
    await onUpdate(id, {
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    })
  }

  if (loading) {
    return <p className="loading-text">도서 정보를 불러오는 중입니다...</p>
  }

  if (error) {
    return <p className="error-text">에러: {error}</p>
  }

  if (!book) {
    return <p className="error-text">도서 정보가 없습니다.</p>
  }

  return (
    <section className="create-write-page">
      <h2 className="update-title">도서 정보 수정</h2>
      <form onSubmit={handleSubmit} className="create-write-form">
        {/* <div className="create-write-form"></div> */}
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input 
            id="title"
            type="text" 
            value={book.title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">저자</label>
          <input 
            id="author"
            type="text" 
            value={book.author} 
            onChange={(e) => setAuthor(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">상세 내용</label>
          <textarea 
            id="content"
            value={book.content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
            rows="8" cols="50"
          />
        </div>
        
        <div className="button-group">
          <button type="submit" className="create-submit-button">수정 완료</button>
          <button type="button" className="create-preview-button" onClick={() => navigate('/list')}>취소</button>
        </div>

      </form>
    </section>
  )
}
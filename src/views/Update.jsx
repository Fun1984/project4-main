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
    <UpdateForm
      initialBook={book}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/list')}
    />
  )
}


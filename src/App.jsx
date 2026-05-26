import React, { useState, useMemo, useEffect } from 'react'
import './App.css'
import List from './views/List'
import Header from './components/Header'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Home from './views/Home'
import Create from './views/Create'
import Update from './views/Update'

function App() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const bookURL = 'http://localhost:3000/books'

  {/*load*/}
  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch(bookURL)
        const data = await res.json()
        setBooks(data)
        console.log(data)
      } catch (err) {
        console.error(err)
        setError('데이터를 불러오지 못했어요.')
      }
      setLoading(false)
    }
    loadBooks()
  }, [])

  {/*Add*/}
  const handleAddBook = async (newBook) => {
    try{
      const res = await fetch(bookURL,
        {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(newBook)
        });
      const saved = await res.json()
      setBooks([saved, ...books])
      navigate('/list')
    } catch (err) {
      console.error(err);
    }
  };

  {/* Update*/}
  const handleUpdateBook = async (id, updatedFields) => {
    try {
      const res = await fetch(`${bookURL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      })
      const updated = await res.json()
      setBooks(books.map((b) => (b.id === id ? updated : b)))
      navigate('/list');
    } catch (err) {
      console.error(err)
    }
  };

  {/*Delete*/}
  const handleDelete = async (id) => {
    try {
      await fetch(`${bookURL}/${id}`,
        {method: 'DELETE'}
      );
      setBooks(books.filter(p => p.id !== id));
    } catch(err) {
      console.error(err);
    }
  };

  {/*Like*/} 
  const handleLike = async (id) => {
    try {
      const book = books.find(p => p.id === id);
      const res = await fetch(`${bookURL}/${id}`,
        {
          method:'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({likes: book.likes + 1})
        }
      );
      const updated = await res.json()
      setBooks(books.map((p) => (p.id === id ? updated : p)))
    } catch (err) {
      console.error(err);
    }
  };

  // const filteredItems = useMemo(() => {
  //   const q = query.trim().toLowerCase()
  //   if (!q) return sampleItems
  //   return sampleItems.filter((item) => {
  //     return (
  //       item.title.toLowerCase().includes(q) ||
  //       item.subtitle.toLowerCase().includes(q)
  //     )
  //   })
  // }, [query])

  return (
    <div className="app-root">
      <Header />

      <main className="app-main">
        {/* Search only visible on /list route */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/list"
            element={
              <>
                <div className="header-center" style={{ marginBottom: '24px' }}>
                  <input
                    aria-label="search"
                    className="search-input"
                    placeholder="책 제목이나 설명으로 검색"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <List query={query} books={books} />
              </>
            }
          />
          <Route path="/create" element={<Create onCreate={handleAddBook}/>} />
          <Route path= "/update/:id" element={<Update items={books} onUpdate={handleUpdateBook} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

import React, { useState, useMemo } from 'react'

function Card({ item, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <img
        className="card-img"
        src={item.coverImageUrl && item.coverImageUrl.trim() ? item.coverImageUrl : '/noImage.jpg'}
        alt={item.title}
      />
      <div className="card-content">
        <h3>{item.title}</h3>
        <p>{item.content}</p>
      </div>
    </div>
  )
}

export default function List({ query = '', books = [] }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return books
    return books.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q)
      )
    })
  }, [query, books])

  const handleOpen = (item) => {
    setSelected(item)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelected(null)
  }

  return (
    <div>
      <div className="image-grid">
        {filteredItems.map((item) => (
          <Card key={item.id} item={item} onClick={() => handleOpen(item)} />
        ))}
      </div>

      {open && selected && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selected.title}</h3>
              <button className="modal-close" onClick={handleClose}>✕</button>
            </div>
            <img
              className="modal-image"
              src={selected.coverImageUrl && selected.coverImageUrl.trim() ? selected.coverImageUrl : '/noImage.jpg'}
              alt={selected.title}
            />
            <p className="modal-subtitle">{selected.content}</p>
            <div className="modal-actions">
              <button className="modal-button" onClick={handleClose}>수정</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

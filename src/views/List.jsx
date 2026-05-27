import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

function Card({ item, onClick }) {
  const imageSrc =
    item.coverImageUrl && item.coverImageUrl.trim()
      ? item.coverImageUrl
      : item.image || '/noImage.jpg'

  return (
    <article
      className="list-book-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <img className="list-book-image" src={imageSrc} alt={item.title} />
      <div className="list-book-content">
        <h3>{item.title}</h3>
        <div className="list-book-meta">
          <p className="list-book-author">작가: {item.author || '저자 미상'}</p>
          <div className="list-book-meta-right">
            <em>좋아요 {item.likes || 0}</em>
            <span className="list-book-views">조회 {item.views || 0}</span>
            
          </div>
        </div>
      </div>
    </article>
  )
}

export default function List({ query = '', books = [], onDelete, onLike, onView }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const selected = selectedId ? books.find((book) => book.id === selectedId) : null

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) return books

    return books.filter((item) => {
      const title = item.title || ''
      const author = item.author || ''


      return (
        title.toLowerCase().includes(q) ||
        author.toLowerCase().includes(q)
      )
    })
  }, [query, books])

  const isSearching = query.trim().length > 0
  const isEmpty = filteredItems.length === 0

  const handleOpen = (item) => {
    setSelectedId(item.id)
    setOpen(true)
    if (item && item.id) {
      onView(item.id);
    }
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedId(null)
  }


  const handleDeleteClick = async () => {
    if (!selected || !onDelete) return

    if (window.confirm('정말 이 도서를 삭제하시겠습니까?')) {
      await onDelete(selected.id)
      handleClose()
    }
  }

  const handleLikeClick = () => {
    if (selected && onLike) {
      onLike(selected.id)
    }
  }

  // if (loading) {
  //   return <p className="list-state-message">도서 목록을 불러오는 중입니다.</p>
  // }

  // if (error) {
  //   return <p className="list-state-message">{error}</p>
  // }


  return (
    <div className="list-page-wrap">
      {/* UI/레이아웃팀 담당: List 페이지 카드 그리드 레이아웃 */}
      {isEmpty ? (
        <p className="list-state-message">
          {isSearching ? '검색 결과가 없습니다. 다른 검색어를 입력해 보세요.' : '등록된 도서가 없습니다.'}
        </p>
      ) : (
        <section className="list-book-grid">
          {filteredItems.map((item) => (
            <Card key={item.id} item={item} onClick={() => handleOpen(item)} />
          ))}
        </section>
      )}

      {open && selected && (
        <div className="book-modal-overlay" onClick={handleClose}>
          {/* UI/레이아웃팀 담당: 상세 모달 UI/레이아웃 정리 */}
          <section className="book-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="book-detail-header">
              <div>
                <h3>{selected.title}</h3>
                {/* UI/레이아웃팀 담당: 작가 이름을 책 제목 아래에 배치 */}
                <p className="book-detail-author">작가: {selected.author || '저자 미상'}</p>
              </div>

              <button type="button" className="book-detail-close" onClick={handleClose}>
                닫기
              </button>
            </div>

            <img
              className="book-detail-image"
              src={
                selected.coverImageUrl && selected.coverImageUrl.trim()
                  ? selected.coverImageUrl
                  : selected.image || '/noImage.jpg'
              }
              alt={selected.title}
            />
            <p className="modal-subtitle">{selected.content}</p>

            {/* UI/레이아웃팀 담당: 좋아요 개수 표시 UI만 배치 */}
            {/* TODO: 좋아요 클릭 기능과 PATCH /books/id 연결은 CRUD 담당자가 처리 */}
            <div className="book-detail-actions">
              
              <div className="book-like-info">
                <span>좋아요</span>
                <strong>{selected.likes || 0}</strong>
                <span>조회수</span>
                <strong>{selected.views || 0}</strong>
              </div>
                <button
                type="button"
                className="modal-button modal-button--delete"
                onClick={handleDeleteClick}
              >
                삭제
              </button>
              <button type="button" className="book-like-button" onClick={handleLikeClick}>
                <span aria-hidden="true">😍</span>
                좋아요
              </button>

              <button
                type="button"
                className="modal-button modal-button--edit"
                onClick={() => {
                  navigate(`/update/${selected.id}`)
                }}
              >
                수정
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}


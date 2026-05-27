import {useState, useEffect} from 'react'
import Dropdown from './Dropdown'

// /noImage.jpg는 없나요? 
// db default 이미지 /noImage.jpg로 잡아뒀고, 
// UI 상에 보이는 loading.gif의 경우, showImg 로 대체했습니다. 

// function getSavableImageUrl(imageUrl) {
//   const invalidPreviewImages = [
//     '/test_src/error.png',
//     './test_src/error.png',
//     '/test_src/loading.gif',
//     './test_src/loading.gif',
//   ]

//   if (!imageUrl || invalidPreviewImages.includes(imageUrl)) {
//     return '/noImage.jpg'
//   }

//   return imageUrl
// }

function CreateImageForm({title, author, content, onAddBook}) {
    const [today, setToday] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const [quality, setQuality] = useState('medium');
    const [ai_api_key, setAi_api_key] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('/noImage.jpg');
    
    const [loading, setLoading] = useState(false);
    const [showImg, setShowImg] = useState('');

  useEffect(() => {
    const now = new Date().toISOString()
    setCreatedAt(now)
    setUpdatedAt(now)
  }, [])

  const handlePreviewImage = async () => {
    const prompt = `
                        # 역할
                        너는 북커버 제작 담당자야.

                        # 지침
                        - 북커버의 앞면 표지만을 보여줄 것
                        - 전문적인 북커버 디자인, 높은 퀄리티의 일러스트레이션, 두드러진 시각적 표현, 작품에 적합한 안전성
                        - 이야기의 분위기나 무드를 포함

                        # 책 정보
                        - 제목 : "${title}"
                        - 내용 요약 : ${content}.
                        `

    try {
      setLoading(true)
      setCoverImageUrl('/test_src/loading.gif')

      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt,
          n: 1,
          size: '1024x1536',
          quality,
          output_format: 'png',
        }),
      })

      if (!res.ok) {
        setCoverImageUrl('/test_src/error.png')
        const errData = await res.json().catch(() => ({}))
        const status = res.status
        if (status === 401) throw new Error('API Key가 올바르지 않습니다. 확인 후 다시 시도해주세요.')
        if (status === 429) throw new Error('요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.')
        throw new Error(errData?.error?.message || 'OpenAI 이미지 생성에 실패했습니다.')
      }

      const data = await res.json()
      const b64Json = data?.data?.[0]?.b64_json
      if (!b64Json) throw new Error('이미지 데이터를 받지 못했습니다.')

      setCoverImageUrl(`data:image/png;base64,${b64Json}`)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitBook = async () => {
    const newBook = {
      id: Math.floor(Math.random() * 1000000),
      title,
      author,
      content,
      likes: 0,
      views: 0,
      coverImageUrl: getSavableImageUrl(coverImageUrl),
      createdAt,
      updatedAt: new Date().toISOString(),
    }

    if (onAddBook) {
      await onAddBook(newBook)
      return
    }

    try {
      const res = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      })
      if (!res.ok) {
        throw new Error('도서 등록에 실패했습니다.')
      }
    } catch (err) {
      console.error(err)
    }
  }
    
    return (
        <form className="create-write-layout">
            <div className="create-write-form">
                <label>
                    api키
                    <input
                        value={apiKey}
                        placeholder="api키"
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                </label>

                <div className="create-quality-group">
                    <p>품질</p>
                    <Dropdown value={quality} onChange={setQuality} />
                </div>

                <div className="create-action-row">
                    <button
                        type="button"
                        className="create-preview-button"
                        onClick={handlePreviewImage}
                        disabled={loading}
                    >
                    {loading ? '이미지 생성 중...' : '이미지 미리보기'}
                    </button>

                    <button
                    type="button"
                    className="create-submit-button"
                    onClick={handleFinalForm}
                    >
                    등록하기
                    </button>
                </div>
            </div>

            <aside className="create-preview-card">
                <div className="create-preview-image-box">
                    <img src={coverImageUrl} alt="book cover" />
                </div>

                <strong>이미지 미리보기</strong>
                <p>선택된 품질: {quality}</p>
                <span>
                    입력 작성 후 이미지 미리보기를 누르면 표지가 먼저 생성하세요
                </span>
            </aside>
        </form>
    )
};

export default CreateImageForm;
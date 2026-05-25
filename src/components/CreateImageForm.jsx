import {useState, useEffect} from 'react'
import Dropdown from './Dropdown'

function CreateImageForm({title, author, content}) {
    const [today, setToday] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const [quality, setQuality] = useState('middle');
    const [ai_api_key, setAi_api_key] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('./test_src/01.png');
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const day = new Date();
        const day_form = `${day.getFullYear()}년 ${day.getMonth()+1}월 ${day.getDate()}일`;
        setToday(day_form);
        setCreatedAt(day);
        setUpdatedAt(day);
    }, []);
    // 책 정보 db 저장을 선행할 경우, 사용. 
    // 지금 구조에서는 AI 생성까지 다 하고 저장하기로 함.
    // const handleAddBook = async (newBook) => {
    // try {
    //   const res = await fetch('http://localhost:3000/books', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify(newBook)
    //   });
    // //   console.log(res.ok)
    //    const text = await res.text();
    // //    console.log(text);
    //   const saved = await res.json();
    //   setPosts([saved, ...posts]);
    // } catch (err) { console.error(err); }
    // };
    const handleFinalForm = async () => {
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
        // 1. AI Image 생성
        try {
            if (loading === false) {
                setCoverImageUrl('./test_src/loading.gif');
                setLoading(true);
            }
            const API_KEY = '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'
            
            const res = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                      'Authorization': `Bearer ${API_KEY}`
                     },
            body: JSON.stringify({
                                    model: 'gpt-image-2',
                                    prompt,
                                    n: 1,
                                    size: '1024x1536',
                                    quality,
                                    output_format: 'png',
                                }),
                    });
            setLoading(false);

            if (!res.ok) {
                setCoverImageUrl('./test_src/error.png');
                const errData = await res.json().catch(() => ({}))
                const status = res.status
                if (status === 401) throw new Error('API Key가 올바르지 않습니다. 확인 후 다시 시도해주세요.')
                if (status === 429) throw new Error('요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.')
                throw new Error(errData?.error?.message || 'OpenAI 이미지 생성에 실패했습니다.')
            }

            const data = await res.json();
            const b64Json = data?.data?.[0]?.b64_json;
            if (!b64Json) throw new Error('이미지 데이터를 받지 못했습니다.');
            
            const imageUrl = `data:image/png;base64,${b64Json}`;
            setCoverImageUrl(imageUrl);
            } catch (err) { console.error(err); }
            
            // 2. db 저장
            const newBook = { title, content, author,
                              likes:0, views:0, imageUrl:coverImageUrl,
                              createdAt, updatedAt }
            try {
                const res = await fetch('http://localhost:3000/books', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(newBook)
                });
                console.log(res.ok)
            } catch (err) { console.error(err) };   
        }
    
    return (<>
    <form>
        <div>
            <p>OpenAI API Key:</p>
            <input value={ai_api_key} onChange={(e) => setAi_api_key(e.target.value)}></input>
            <p>품질 :</p> <Dropdown value={quality} onChange={setQuality} />
        </div>
        <div><img src={coverImageUrl} alt="book cover" style={{ width: '200px', height: 'auto'}}></img></div>
        <div>
            <h3>책 내용</h3>
            <p>{content}</p>
            <br></br>
            <p>생성일 : {today}</p>
            <p>수정일 : {today}</p>
        </div>
        <hr />
        <button type='button' onClick={handleFinalForm}>최종 제출</button>
    </form>
    </>)
};

export default CreateImageForm;
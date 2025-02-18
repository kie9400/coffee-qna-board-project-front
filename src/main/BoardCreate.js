import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BoardCreate = () => {
    const navigate = useNavigate(); //main page로 이동
    const [file, setFile] = useState(null); //업로드 파일 상태
    const [boardInput, setBoardInput] = useState({
        title: "",
        content: "",
        visibiity: "PUBLIC"
    });

    const handleInputChange = (e) => {
         setBoardInput((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };
    
    const handleCreate = async (e) => {
        const token = localStorage.getItem('accessToken'); 
        
        //Board Post 요청은 데이터를 form-Data로 받는다.
        const formData = new FormData;

        //FormData 객체에 데이터를 추가한다.
        //또한, 자바스크립트 객체를 JSON 타입으로 변환한다.
        formData.append('board', JSON.stringify({
            title: boardInput.title,
            content: boardInput.content,
            visibility: boardInput.visibility
        }));

        // file이 존재하면 formData에 파일 추가
        if (file) {
            formData.append('file', file);
        }

        try{
            //requset data
            const res = await axios.post('http://localhost:8080/api/boards', formData, {
                // 액세스 토큰을 헤더에 포함
                headers: {
                   'Content-Type': 'application/json', // 요청 헤더에 multipart/form-data로 설정
                    Authorization: `${token}`,  
                }
            });
            alert('게시글 작성완료')
            navigator('/board');
        } catch (error) {
            console.log(error);
            alert('서버 오류가 발생했습니다.');
        }
    }

    return (
        <div>
            글 작성 페이지입니다.
            <div>
                <label htmlFor='title'>제목</label>
                <input
                id='title'
                type='text'
                value={boardInput.title}
                onChange={handleInputChange}
                placeholder='제목을 입력하세요'
                ></input>
            </div>
            <div>
                <label htmlFor='content'>내용</label>
                <input
                id='content'
                type='text'
                value={boardInput.content}
                onChange={handleInputChange}
                placeholder='제목을 입력하세요'
                ></input>
            </div>
            <div>
                <label htmlFor="visibility">공개 상태</label>
                <select
                    id="visibility"
                    value={boardInput.visibility}
                    onChange={handleInputChange}>
                    <option value="PUBLIC">공개</option>
                    <option value="SECRET">비밀</option>
                </select>
            </div>
            <button onClick={handleCreate}>작성하기</button>
        </div>
    );
}

export default BoardCreate;
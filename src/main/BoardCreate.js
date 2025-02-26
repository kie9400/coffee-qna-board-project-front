import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BoardCreate.css';

const BoardCreate = () => {
    const navigate = useNavigate(); //main page로 이동
    const [file, setFile] = useState(null); //업로드 파일 상태
    const [boardInput, setBoardInput] = useState({
        title: "",
        content: "",
        visibility: "PUBLIC"
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
        const boardData = JSON.stringify({
            title: boardInput.title,
            content: boardInput.content,
            visibility: boardInput.visibility
        });

        //FormData를 사용하면 브라우저가 자동으로 Content-type를 multipart/form-data로 설정
        //그렇기에 변환한 board 데이터를 Blob 객체로 FormData에 추가한다.
        //Blob은 바이너리 형태에서도 큰 객체를 의미하며, 멀티 데이터(이미지, 비디오 등)를 다룰 때 사용
        //이렇게 하면 JSON 형식을 유지하면서 multipart/form-data로 데이터를 보낼 수 있다.
        //이로인해 Spring 컨트트롤러에서도 @RequetPart()에 JSON을 받기가 가능하다.
        formData.append('board', new Blob([boardData], { type: 'application/json'}));

        // file이 존재하면 formData에 파일 추가
        if (file) {
            formData.append('file', file);
        }

        try{
            //requset data
            //FormData를 사용하면 브라우저가 자동으로 Content-type를 multipart/form-data로 설정
            //그렇기에 headers에 content-type를 작성하지 않아도된다.
            const res = await axios.post('http://localhost:8080/api/boards', formData, {
                // 액세스 토큰을 헤더에 포함
                headers: {
                    Authorization: `${token}`  
                }
            });
            alert('게시글 작성완료');
            navigate('/board');
        } catch (error) {
            console.log(error);
            alert('서버 오류가 발생했습니다.');
        }
    }

    return (
        <div className='board-create-container'>
            <h2>글 작성 페이지</h2>
            <div className='input-group'>
                <label htmlFor='title'>제목</label>
                <input
                id='title'
                type='text'
                value={boardInput.title}
                onChange={handleInputChange}
                placeholder='제목을 입력하세요'
                ></input>
            </div>
            <div className='input-group'>
                <label htmlFor='content'>내용</label>
                <input
                id='content'
                type='text'
                value={boardInput.content}
                onChange={handleInputChange}
                placeholder='제목을 입력하세요'
                ></input>
            </div>
            <div className='input-group'>
                <label htmlFor="visibility">공개 상태</label>
                <select
                    id="visibility"
                    value={boardInput.visibility}
                    onChange={handleInputChange}>
                    <option value="PUBLIC">공개</option>
                    <option value="SECRET">비밀</option>
                </select>
            </div>
            <div className='board-create-form button'>
                 <button onClick={handleCreate}>작성하기</button>
            </div>
        </div>
    );
}

export default BoardCreate;
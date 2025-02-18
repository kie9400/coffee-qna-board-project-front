// Board.js 파일 예시
import React from 'react';
import { useState, useEffect } from 'react';
import './Board.css'; // CSS 파일 불러오기
import axiosInstance from "../api/axiosInstance";

const Board = () => {
    const [boards, setBoards] = useState([]);   // 제목만 저장하는 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null);    // 에러 상태
    const [page, setPage] = useState(1);         // 현재 페이지 번호
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  
    // 페이지가 변경될 때마다 호출되는 useEffect
    useEffect(() => {
      const fetchboards = async () => {
         // 로컬에서 액세스 토큰 가져오기
        const token = localStorage.getItem('accessToken'); 
  
        try {
          const res = await axiosInstance.get(`/boards?page=${page}&size=10&sort=oldest`, {
            headers: {
              Authorization: `${token}`,  // JWT 토큰을 헤더에 포함
            },
          });

          //응답 데이터에서 data를 뽑아온다.
          const boards = res.data.data || []; // content가 없으면 빈 배열로 처리
          setBoards(boards)  // 질문글 상태 변경(데이터 저장)
          setTotalPages(res.data.pageInfo.totalPages);  // 총 페이지 수 저장
        } catch (error) {
          setError('게시글을 불러오는 데 실패했습니다.');
        } finally {
          setLoading(false);
        }
      };  
      fetchboards();
    }, [page]); // 페이지 번호가 변경될 때마다 API 요청을 다시 보냄
  
    if (loading) return <p>Loading...</p>;
  
    // 페이지네이션 버튼 클릭 핸들러
    const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        // 버튼 클릭시 페이지 번호 상태 변경
        setPage(newPage); 
      }
    };
  
    return (
      <div className='board-container'>
        <ul>
        <h1>질문 게시판</h1>
        {/* 만약 배열의 길이가 0보다 크면 li태그를 만든다. */}
        <button>글 작성</button>
        {Array.isArray(boards) && boards.length > 0 ? (
          boards.map((board) => 
            (<li key={board.boardId}>
                {/* 제목을 클릭하면 글을 조회할 수 있다.*/}
                <h4>제목 : {board.title}</h4>
                <p className="likeCount">추천수 : {board.likeCount}</p>
                <p className="viewCount">조회수 : {board.viewCount}</p>
                {/* 내용 일단단 안보이게설정 <p>{board.content}</p> */}
                <p className='date'>작성일 : {new Date(board.createdAt).toLocaleString()}</p>
                <p className='date'>수정일 : {new Date(board.modifiedAt).toLocaleString()}</p>
            </li>))) : (<p>게시글이 없습니다.</p>)}
        </ul>
        <div className='pagination'>
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                이전    
            </button>
            <span> 페이지번호 : {page} </span>
            {/* 페이지 최대 수까지 누를 수 있다. */}
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                다음
            </button>
        </div>
      </div>
      
    );
  }

export default Board;
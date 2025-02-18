// Board.js 파일 예시
import React from 'react';
import { useState, useEffect } from 'react';
import axiosInstance from "../api/axiosInstance";

const Board = () => {
    const [titles, setTitles] = useState([]);   // 제목만 저장하는 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null);    // 에러 상태
    const [page, setPage] = useState(1);         // 현재 페이지 번호
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  
    // 페이지가 변경될 때마다 호출되는 useEffect
    useEffect(() => {
      const fetchPosts = async () => {
         // 로컬에서 액세스 토큰 가져오기
        const token = localStorage.getItem('accessToken'); 
  
        try {
          const res = await axiosInstance.get(`/boards?page=${page}&size=10&sort=oldest`, {
            headers: {
              Authorization: `${token}`,  // JWT 토큰을 헤더에 포함
            },
          });
          const posts = res.data.data || []; // content가 없으면 빈 배열로 처리
          setTitles(posts.map(post => post.title));  // title만 추출
          setTotalPages(res.data.pageInfo.totalPages);  // 총 페이지 수 저장
        } catch (error) {
          setError('게시글을 불러오는 데 실패했습니다.');
        } finally {
          setLoading(false);
        }
      };  
      fetchPosts();
    }, [page]); // 페이지 번호가 변경될 때마다 API 요청을 다시 보냄
  
    if (loading) return <p>Loading...</p>;
  
    // 페이지네이션 버튼 클릭 핸들러
    const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage); // 페이지 번호 업데이트
      }
    };
  
    return (
      <div>
        <ul>
        <h1>게시판</h1>
        {Array.isArray(titles) && titles.length > 0 ? (
          titles.map((title, index) => 
            (<li key={index}>{title}</li>))) : (<p>게시글이 없습니다.</p>)}
        </ul>
        <div>
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
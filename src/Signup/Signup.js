import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../api/axiosInstance";
import './Signup.css';

const Signup = () => {
    const [signupInput, setSignupInput] = useState({
        nickname: "",
        email: "",
        password: "",
    });
    //에러 상태 설정을 위한 useState 훅
    const [error, setError] = useState('');
    const navigate = useNavigate();  // 회원가입 성공시 페이지 이동시킬 useNavigate 훅

    //이메일과 비밀번호를 입력받고 setSigupInput에 저장한다.
    const handleInputChange = (e) => {
        setSignupInput((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post('/members', {
                nickName: signupInput.nickname,
                email: signupInput.email,
                password: signupInput.password,
            });
            if (res.status === 201) {
              navigate('/')
              console.log(res.data);
            }
        }
        catch (error) {
          if(error.status === 409) {
            setError('이미 가입된 회원입니다.');
          } else if(error.status === 400) {
            setError('유효하지 않은 이메일, 비밀번호 형식입니다.');
          } else {
            setError('알 수 없는 에러가 발생하였습니다.');
          }
        }
    }
        
   
      return (
        <div className="signup-container">
          <h2>회원가입</h2>
          <div className="input-group">
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              value={signupInput.nickname}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">이메일</label>
            <input
              type="text"
              id="email"
              value={signupInput.email}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={signupInput.password}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={handleSignup} className="signup-button">회원가입</button>
        </div>
      );
};

export default Signup;
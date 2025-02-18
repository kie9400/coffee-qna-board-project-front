import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // CSS 파일 불러오기
import axiosInstance from "../api/axiosInstance";

const Login = () => {
  const [loginInput, setLoginInput] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  //에러 상태 설정을 위한 useState 훅
  const [error, setError] = useState('');


  //이메일과 비밀번호를 입력받고 setLoginInput에 저장한다.
  const handleInputChange = (e) => {
    setLoginInput((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await axiosInstance.post('/auth/login', {
            username: loginInput.username,
            password: loginInput.password,
        });
        if (res.status === 200) {
            //받은 JWT 토큰을 localStorage에 저장해야 한다.
            //그러기 위해 응답 헤더에서 토큰을 추출
            const accessToken = res.headers['authorization']
            const refreshTokne = res.headers['refreshToken']
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
            }
            if (refreshTokne) {
                localStorage.setItem('refreshToken', refreshTokne);
            }
            navigate('/board')
            console.log(accessToken);
            console.log(res.data);
        }
    } catch (error) {
      if(error.status === 404) {
        setError('가입하지 않은 회원입니다.');
      }else if(loginInput.username === '' || loginInput.password === ''){
        setError("이메일 또는 비밀번호를 입력해주십시오");
      }else if(error.status === 401){
        setError('없는 회원이거나 이메일, 비밀번호가 틀렸습니다.');
      }else {
        setError('알 수 없는 에러가 발생하였습니다.');
      }
    }
  };

  const goToSignup = () => {
    navigate('/signup');  // 회원가입 페이지로 이동
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <label htmlFor="username">이메일:</label>
          <input
            type="text"
            id="username"
            value={loginInput.username}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={loginInput.password}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="summit" onClick={handleLogin} className="login-button">로그인</button>
        <button onClick={goToSignup} className="signup-button">회원가입</button>
      </form>
    </div>
  );
};

export default Login;
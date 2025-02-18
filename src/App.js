import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Signup/Login';  // 로그인 화면
import Signup from './Signup/Signup';  // 회원가입 화면
import Board from './main/Board'; //게시판 화면

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

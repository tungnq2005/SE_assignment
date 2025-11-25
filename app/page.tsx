"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Dùng để chuyển trang
import toast from 'react-hot-toast'; // Thông báo đẹp

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // LOGIC GIẢ LẬP BACKEND LOGIN
    // Sau này thay đoạn này bằng API call: axios.post('/api/login', ...)
    if (username === 'admin') {
      toast.success('Chào mừng Admin!');
      router.push('/admin');
    } else if (username === 'tutor') {
      toast.success('Chào mừng Tutor Lương Ngọc Trung!');
      router.push('/tutor');
    } else if (username === 'student') {
      toast.success('Chào mừng Sinh viên!');
      router.push('/student');
    } else {
      toast.error('Tài khoản không tồn tại! (Thử: student, tutor, hoặc admin)');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#475569]">
      <div className="flex flex-row items-center space-x-20">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center">
          <Image src="/logo-bkhcm.png" alt="HCMUT Logo" width={150} height={150} />
          <h1 className="text-white text-4xl font-bold mt-4">HCMUT TUTOR</h1>
        </div>

        {/* Login Form */}
        <div className="bg-white p-10 rounded-lg shadow-xl w-96">
          <h2 className="text-3xl font-bold text-center mb-2">Đăng nhập</h2>
          <p className="text-center text-red-600 text-sm mb-6">Nhập thông tin tài khoản của bạn</p>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Tên đăng nhập (student/tutor/admin)" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <input 
                type="password" 
                placeholder="Mật khẩu (Gõ gì cũng được)" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
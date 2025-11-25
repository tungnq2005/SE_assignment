// BẮT BUỘC phải có dòng này ở trên cùng
"use client";

import { useState } from 'react'; // Dùng để quản lý trạng thái (mở/đóng)
import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineSearch, HiOutlineBell, HiOutlineChatAlt, HiOutlineChevronDown, HiOutlineUser, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi';

// Component giờ đây nhận 'role'
export default function Header({ role }: { role: 'student' | 'tutor' | 'admin' }) {
  // Tạo một state để theo dõi menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between h-16 bg-white px-6 shadow-sm">
      {/* Ô tìm kiếm */}
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96">
        <HiOutlineSearch className="w-5 h-5 text-gray-500" />
        <input 
          type="text"
          placeholder="Tìm kiếm..."
          className="bg-transparent ml-2 outline-none text-sm w-full"
        />
      </div>

      {/* Các icon bên phải và Avatar */}
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <HiOutlineChatAlt className="w-6 h-6 text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <HiOutlineBell className="w-6 h-6 text-gray-600" />
        </button>
        
        {/* Khu vực Avatar và Dropdown - bọc trong 'relative' */}
        <div className="relative">
          {/* Nút bấm để mở/đóng menu */}
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Bật/tắt state
            className="flex items-center space-x-2 cursor-pointer p-1 rounded-lg hover:bg-gray-100"
          >
            <Image 
              src="/avatar-placeholder.jpg" 
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-sm font-medium">Chutine</span>
            <HiOutlineChevronDown className="w-4 h-4 text-gray-600" />
          </button>

          {/* === MENU THẢ XUỐNG === */}
          {/* Chỉ hiển thị khi isDropdownOpen là true */}
          {isDropdownOpen && (
            <div 
              className="
                absolute top-full right-0 mt-2 w-48 
                bg-white rounded-lg shadow-xl border z-10
              "
            >
              <ul className="py-1">
                {/* Link sẽ tự động là /student/profile hoặc /tutor/profile 
                  tùy vào 'role' bạn truyền vào
                */}
                <Link href={`/${role}/profile`}>
                  <li className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <HiOutlineUser className="w-5 h-5 mr-3" />
                    Tài khoản
                  </li>
                </Link>
                <Link href={`/${role}/settings`}>
                  <li className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <HiOutlineCog className="w-5 h-5 mr-3" />
                    Cài đặt
                  </li>
                </Link>
                {/* Nút Đăng xuất sẽ về trang chủ (Login) */}
                <Link href="/"> 
                  <li className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t mt-1">
                    <HiOutlineLogout className="w-5 h-5 mr-3" />
                    Đăng xuất
                  </li>
                </Link>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
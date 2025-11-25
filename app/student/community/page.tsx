"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineSearch, HiOutlineFilter, HiX } from 'react-icons/hi';

export default function CommunityPage() {
  const [showPopup, setShowPopup] = useState(false); // Quản lý đóng mở Popup

  return (
    <div className="flex h-full gap-6">
      
      {/* === CỘT TRÁI: DANH SÁCH NHÓM & BỘ LỌC (Chiếm 70%) === */}
      <div className="flex-1 space-y-6">
        
        {/* Bộ lọc */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Cộng đồng nổi bật</h2>
            <HiOutlineFilter className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {['Danh mục', 'Khoa', 'Loại', 'Phổ biến'].map((filter) => (
              <button key={filter} className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-300">
                {filter} ▾
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách các nhóm */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
          <div className="flex justify-between mb-4">
             <div className="p-2 border rounded-full"><HiOutlineSearch /></div>
             <span className="text-green-600 font-bold cursor-pointer">Tất cả</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thẻ Nhóm (Lặp lại) */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="border border-gray-200 rounded-xl p-4 flex flex-col items-center bg-[#FFFBEB]">
                <h3 className="font-bold text-lg mb-2">Tên nhóm</h3>
                {/* Ảnh cover nhóm */}
                <div className="w-full h-32 bg-gray-300 rounded-lg mb-3 relative overflow-hidden">
                   {/* Bạn thay src bằng ảnh thật */}
                   <Image src="/group-cover.jpg" alt="Cover" fill className="object-cover" />
                </div>
                <p className="font-bold text-sm mb-3">👥 36k thành viên</p>
                <button 
                  onClick={() => setShowPopup(true)} // Bấm nút thì mở Popup
                  className="bg-blue-700 text-white font-bold py-2 px-8 rounded-full hover:bg-blue-800"
                >
                  Tham gia
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === CỘT PHẢI: CỘNG ĐỒNG ĐÃ THAM GIA (Chiếm 30%) === */}
      <div className="w-80 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
        <h2 className="font-bold text-xl text-center mb-6">Cộng đồng đã tham gia</h2>
        <h3 className="text-gray-400 font-bold text-sm mb-4">Hoạt động gần đây</h3>
        
        <div className="space-y-3">
          {/* Item nhóm đã tham gia */}
          <Link href="/student/community/chat"> {/* Link tới trang chat */}
            <div className="flex items-center bg-gray-200 p-3 rounded-xl cursor-pointer hover:bg-gray-300 transition mb-3">
               <div className="w-10 h-10 bg-yellow-600 rounded-md mr-3"></div> {/* Ảnh nhỏ */}
               <span className="font-bold text-gray-800">Nhóm tấu hài</span>
            </div>
          </Link>
          
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center bg-gray-200 p-3 rounded-xl cursor-pointer hover:bg-gray-300 transition">
               <div className="w-10 h-10 bg-yellow-600 rounded-md mr-3"></div>
               <span className="font-bold text-gray-800">Nhóm tấu hài</span>
            </div>
          ))}
        </div>
      </div>

      {/* === POPUP XÁC NHẬN (Ảnh 3) === */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 relative shadow-2xl animate-bounce-in">
            {/* Nút đóng */}
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <HiX className="w-6 h-6" />
            </button>

            <h3 className="text-blue-800 font-bold text-xl text-center mb-2">Xác nhận tham gia ?</h3>
            <p className="text-center text-gray-600 mb-6">
              Bạn có chắc chắn muốn tham gia nhóm không?
            </p>

            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setShowPopup(false)}
                className="bg-blue-800 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-900"
              >
                Hủy
              </button>
              <button 
                onClick={() => setShowPopup(false)} // Sau này sẽ xử lý logic join
                className="bg-green-600 text-white font-bold py-2 px-6 rounded-full hover:bg-green-700"
              >
                Tham gia
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
import Image from 'next/image';
import { HiOutlineSearch, HiPaperAirplane } from 'react-icons/hi';

export default function CommunityChatPage() {
  return (
    <div className="flex h-full gap-6">
      
      {/* === KHUNG CHAT (Giống ảnh 2) === */}
      <div className="flex-1 bg-gray-200 rounded-2xl flex flex-col overflow-hidden relative border border-gray-300">
        
        {/* Header Chat */}
        <div className="p-4 border-b border-gray-300 flex justify-between items-center bg-gray-100">
           <div className="p-2 border border-gray-400 rounded-full"><HiOutlineSearch /></div>
           <h2 className="font-bold text-xl">Hội đồng hương 36</h2>
           <div></div> {/* Spacer */}
        </div>

        {/* Nội dung tin nhắn */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          
          {/* Tin nhắn người khác */}
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-gray-400 mr-3 flex-shrink-0"></div>
            <div>
              <span className="text-xs font-bold text-gray-600 ml-1">Quê 36</span>
              <div className="bg-gray-300 p-3 rounded-2xl rounded-tl-none text-sm font-medium shadow-sm">
                Hello mọi người
              </div>
            </div>
          </div>

          {/* Tin nhắn của mình (bên phải) */}
          <div className="flex items-end justify-end">
            <div>
              <div className="bg-gray-300 p-3 rounded-2xl rounded-tr-none text-sm font-medium shadow-sm text-right">
                Chào bạn Trung nhé
              </div>
              <div className="text-right"><span className="text-xs font-bold text-gray-600 mr-1">Quê 36</span></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-800 ml-3 flex-shrink-0">
               {/* Avatar mình */}
               <Image src="/avatar-placeholder.png" width={40} height={40} className="rounded-full" alt="Me" />
            </div>
          </div>

           {/* Tin nhắn người khác */}
           <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-blue-200 mr-3 flex-shrink-0"></div>
            <div>
              <span className="text-xs font-bold text-gray-600 ml-1">Quê 36</span>
              <div className="bg-gray-300 p-3 rounded-2xl rounded-tl-none text-sm font-medium shadow-sm">
                Ae ăn cơm trắng cao bò không
              </div>
            </div>
          </div>

        </div>

        {/* Thanh nhập tin nhắn */}
        <div className="p-4 bg-gray-100 flex items-center">
          <input 
            type="text" 
            placeholder="Nhập tin nhắn..." 
            className="flex-1 bg-white p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="ml-3 p-3 bg-black text-white rounded-full hover:bg-gray-800">
            <HiPaperAirplane className="rotate-90" />
          </button>
        </div>

      </div>

      {/* === CỘT PHẢI (Sidebar tham gia) === */}
      {/* (Phần này giống trang trước, có thể tách ra thành Component riêng để tái sử dụng) */}
      <div className="w-80 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
        <h2 className="font-bold text-xl text-center mb-6">Cộng đồng đã tham gia</h2>
        <h3 className="text-gray-400 font-bold text-sm mb-4">Hoạt động gần đây</h3>
        <div className="space-y-3">
           <div className="flex items-center bg-gray-200 p-3 rounded-xl cursor-pointer border border-black/10">
               <div className="w-10 h-10 bg-yellow-600 rounded-md mr-3"></div>
               <span className="font-bold text-gray-800">Nhóm tấu hài</span>
            </div>
            <div className="flex items-center bg-gray-200 p-3 rounded-xl cursor-pointer border border-black/10">
               <div className="w-10 h-10 bg-yellow-600 rounded-md mr-3"></div>
               <span className="font-bold text-gray-800">Nhóm tài năng</span>
            </div>
            <div className="flex items-center bg-white p-3 rounded-xl cursor-pointer border-2 border-gray-800 shadow-md transform scale-105">
               <div className="w-10 h-10 bg-yellow-600 rounded-md mr-3"></div>
               <span className="font-bold text-gray-800">Hội đồng hương 36</span>
            </div>
            <div className="flex items-center bg-gray-200 p-3 rounded-xl cursor-pointer border border-black/10">
               <div className="w-10 h-10 bg-yellow-600 rounded-md mr-3"></div>
               <span className="font-bold text-gray-800">Anti đậu lớn</span>
            </div>
        </div>
      </div>

    </div>
  );
}
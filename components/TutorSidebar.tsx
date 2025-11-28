"use client";

import Image from 'next/image';
import Link from 'next/link';
// 1. IMPORT HOOK usePathname
import { usePathname } from 'next/navigation';
import { HiOutlineHome, HiOutlineCalendar, HiOutlineBookOpen, HiOutlineUserGroup, HiOutlineTrendingUp } from 'react-icons/hi';
import { FaChalkboardTeacher } from 'react-icons/fa';

// Component NavLink (Giữ nguyên)
const NavLink = ({ href, icon: Icon, text, active }: any) => (
  <Link href={href}>
    <div className={`
      flex items-center p-3 rounded-lg text-sm font-medium transition-colors
      ${active 
        ? 'bg-blue-600 text-white shadow-md' // Style khi active đẹp hơn chút
        : 'text-gray-700 hover:bg-gray-100'}
    `}>
      <Icon className={`w-5 h-5 mr-3 ${active ? 'text-white' : 'text-gray-500'}`} />
      {text}
    </div>
  </Link>
);

export default function TutorSidebar() {
  // 2. SỬ DỤNG HOOK ĐỂ LẤY ĐƯỜNG DẪN HIỆN TẠI
  const pathname = usePathname();

  // Hàm kiểm tra xem link có đang active không
  // Ví dụ: đang ở '/tutor/schedule' thì link '/tutor' không active, link '/tutor/schedule' active.
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 h-screen bg-white p-4 flex flex-col shadow-lg border-r">
      {/* Logo */}
      <div className="flex items-center mb-8 p-2">
        <FaChalkboardTeacher className="w-8 h-8 text-blue-600" />
        <span className="text-xl font-bold ml-2 text-blue-900">HCMUT Tutor</span>
      </div>

      <nav className="grow space-y-6">
        <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 px-3">TỔNG QUAN</h3>
            <div className="space-y-1">
            <NavLink 
                href="/tutor" 
                icon={HiOutlineHome} 
                text="Trang chủ"
                // 3. SO SÁNH ĐƯỜNG DẪN CHÍNH XÁC
                active={isActive("/tutor")} 
            />
            <NavLink 
                href="/tutor/schedule" 
                icon={HiOutlineCalendar} 
                text="Lịch dạy của tôi"
                // 3. SO SÁNH ĐƯỜNG DẪN CHÍNH XÁC
                active={isActive("/tutor/schedule")}
            />
            <NavLink 
                href="/tutor/library" 
                icon={HiOutlineBookOpen} 
                text="Thư viện"
                active={isActive("/tutor/library")}
            />
            </div>
        </div>

        <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 px-3">QUẢN LÝ</h3>
            <div className="space-y-1">
            <NavLink 
                href="/tutor/support_in4" 
                icon={HiOutlineUserGroup} 
                text="Thông tin hỗ trợ"
                active={isActive("/tutor/support_in4")}
            />
            <NavLink 
                href="/tutor/progress" 
                icon={HiOutlineTrendingUp} 
                text="Theo dõi tiến bộ"
                active={isActive("/tutor/progress")}
            />
            </div>
        </div>
      </nav>

      <div className="mt-auto">
        <Image src="/merry-christmas.png" alt="Merry Christmas" width={180} height={90} className="mx-auto opacity-80 hover:opacity-100 transition" />
      </div>
    </aside>
  );
}
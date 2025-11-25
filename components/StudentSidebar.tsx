import Image from 'next/image';
import Link from 'next/link';
// Import các icon
import { HiOutlineHome, HiOutlineCalendar, HiOutlineBookOpen, HiOutlineAcademicCap, HiOutlineCog } from 'react-icons/hi';
import { FaChalkboardTeacher } from 'react-icons/fa'; // Cần import thêm
import { HiOutlineUsers } from 'react-icons/hi';

// Component này là 'client component' vì nó có thể có tương tác (sau này)
// "use client" phải ở dòng đầu tiên
// "use client";

// Một component cho mỗi mục menu để dễ quản lý
const NavLink = ({ href, icon: Icon, text, active }: any) => (
  <Link href={href}>
    <div className={`
      flex items-center p-3 rounded-lg text-sm font-medium
      ${active 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-700 hover:bg-gray-100'}
    `}>
      <Icon className="w-5 h-5 mr-3" />
      {text}
    </div>
  </Link>
);

export default function StudentSidebar() {
  // Sau này, bạn sẽ dùng 'usePathname' của Next.js để xác định trang active
  const currentPath = "/student"; // Giả sử đang ở trang chủ

  return (
    <aside className="w-64 h-screen bg-white p-4 flex flex-col shadow-lg">
      {/* Phần Logo và Tên */}
      <div className="flex items-center mb-6 p-2">
        <FaChalkboardTeacher className="w-8 h-8 text-blue-600" />
        <span className="text-xl font-bold ml-2">HCMUT Tutor</span>
      </div>

      {/* Phần điều hướng chính */}
      <nav className="flex-grow">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">TỔNG QUAN</h3>
        <div className="space-y-2">
          <NavLink 
            href="/student" 
            icon={HiOutlineHome} 
            text="Trang chủ"
            active={currentPath === "/student"} // Đang active
          />
          <NavLink 
            href="/student/schedule" 
            icon={HiOutlineCalendar} 
            text="Lịch học của tôi"
            active={false}
          />
          <NavLink 
            href="/student/library" 
            icon={HiOutlineBookOpen} 
            text="Thư viện"
            active={false}
          />
          <NavLink 
            href="/student/community" 
            icon={HiOutlineUsers} 
            text="Cộng đồng"
            active={currentPath.includes("/student/community")}
          />
        </div>

        <h3 className="text-xs font-semibold text-gray-500 uppercase mt-6 mb-2">TRUY CẬP GIẢNG DẠY</h3>
        <div className="space-y-2">
          <NavLink 
            href="#" 
            icon={HiOutlineAcademicCap} 
            text="Cấu trúc rời rạc"
            active={false}
          />
          <NavLink 
            href="#" 
            icon={HiOutlineAcademicCap} 
            text="Mô hình hóa Toán..."
            active={false}
          />
        </div>
      </nav>

      {/* Ảnh Merry Christmas */}
      <div className="mt-auto">
        <Image 
          src="/merry-christmas.png" 
          alt="Merry Christmas" 
          width={200} 
          height={100}
          className="mx-auto"
        />
      </div>
    </aside>
  );
}
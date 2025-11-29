import Image from 'next/image';
import { HiOutlinePencil } from 'react-icons/hi';

// Một component nhỏ để hiển thị thông tin
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <h4 className="text-xs font-semibold text-gray-400 uppercase">{label}</h4>
    <p className="text-sm text-[#0313B0]">{value}</p>
  </div>
);

export default function TutorProfilePage() {
  return (
    // Đặt màu nền xanh đậm cho trang này
    <div className="space-y-6" style={{ color: '#E0E7FF' }}> {/* Màu chữ sáng cho dễ đọc */}
      
      {/* Thẻ Profile trên cùng */}
      <div className="bg-[#F4F7F5] p-6 rounded-lg shadow-lg flex items-center space-x-6">
        <div className="relative">
          <Image 
            src="/avatar-placeholder.jpg" // Dùng chung ảnh avatar
            alt="User Avatar"
            width={120}
            height={120}
            className="rounded-full border-4 border-white/50"
          />
          <button className="absolute bottom-2 right-2 bg-gray-800 p-2 rounded-full hover:bg-gray-700">
            <HiOutlinePencil className="w-5 h-5 text-white" />
          </button>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#0313B0]">Lương Ngọc Trung</h1>
          <p className="text-lg text-[#0313B0]">Tutor</p>
          <p className="text-md text-[#0313B0] mt-2">TP.HCM, Việt Nam</p>
        </div>
      </div>

      {/* Thẻ Thông tin cá nhân */}
      <div className="bg-[#F4F7F5] p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#0313B0]">Thông tin cá nhân</h2>
          <button className="p-2 rounded-full hover:bg-white/20">
            <HiOutlinePencil className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoRow label="Tên" value="Trung" />
          <InfoRow label="Họ" value="Lương Ngọc" />
          <InfoRow label="Ngày sinh" value="02-05-2005" />
          <InfoRow label="Địa chỉ Email" value="trung.deptrai@hcmut.edu.vn" />
          <InfoRow label="Khóa/Khoa" value="K23/Khoa học & Kỹ thuật Máy tính" />
          <InfoRow label="Điện thoại" value="0912490726" />
        </div>
      </div>

      {/* Thẻ Địa chỉ */}
      <div className="bg-[#F4F7F5] p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#0313B0]">Địa chỉ</h2>
          <button className="p-2 rounded-full hover:bg-white/20">
            <HiOutlinePencil className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoRow label="Địa chỉ thường trú" value="[Chưa cập nhật]" />
          <InfoRow label="Địa chỉ tạm trú" value="[Chưa cập nhật]" />
          <InfoRow label="Thông tin liên hệ" value="[Chưa cập nhật]" />
        </div>
      </div>
    </div>
  );
}
// Import component thẻ lớp học
import ClassCard from '@/components/ClassCard';

export default function TutorDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Lời chào Giáng sinh */}
      <div className="p-6 bg-white rounded-lg shadow" style={{backgroundColor: '#EBF4FF'}}> {/* Màu xanh nhạt */}
        <h1 className="text-3xl font-bold text-red-600" style={{fontFamily: 'cursive'}}>
          Giáng sinh an lành, dạy học thật nhanh 🎄
        </h1>
      </div>

      {/* Khu vực nội dung chính */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cột bên trái (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Biểu đồ tròn */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-bold mb-4">Tổng số giờ đã hỗ trợ</h2>
            <div className="h-60 flex items-center justify-center text-gray-400">
              [Biểu đồ tròn sẽ ở đây]
            </div>
          </div>
          
          {/* Các lớp hôm nay (Slider) */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-bold mb-4">Các lớp hôm nay</h2>
            {/* Tạm thời dùng flexbox, sau này sẽ thay bằng slider */}
            <div className="flex space-x-4 overflow-x-auto pb-4">
              <ClassCard 
                title="Công nghệ phần mềm"
                base="2"
                room="H6 - 201"
                time="15h - 17h"
              />
              <ClassCard 
                title="Cấu trúc rời rạc"
                base="2"
                room="H3 - 123"
                time="15h - 17h"
              />
              {/* Thêm các thẻ khác ở đây... */}
            </div>
          </div>
        </div>

        {/* Cột bên phải (1/3) */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Các lớp đang dạy</h2>
          <div className="space-y-3">
            {/* Đây là danh sách đơn giản */}
            <div className="border p-3 rounded-lg bg-gray-50 hover:bg-gray-100">
              Cấu trúc rời rạc - H3 - 201
            </div>
            <div className="border p-3 rounded-lg bg-gray-50 hover:bg-gray-100">
              Công nghệ phần mềm - H6 - 201
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
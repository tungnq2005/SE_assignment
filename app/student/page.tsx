"use client";

import { MOCK_CLASSES } from '@/app/data/mockData';
import ClassCard from '@/components/ClassCard';

export default function StudentDashboardPage() {
  // Lọc ra các lớp mà user đang là 'student'
  const myClasses = MOCK_CLASSES.filter(c => c.type === 'student');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 bg-white rounded-lg shadow flex items-center justify-between">
        <h1 className="text-3xl font-bold text-red-600 font-serif">
          Giáng sinh này bạn có ai học cùng chưa? 🎅
        </h1>
        {/* Placeholder cho ngày tháng hoặc weather widget */}
        <span className="text-gray-500 text-sm">Học kỳ 1 - 2025/2026</span>
      </div>

      {/* Khu vực Gợi ý (Lấy tất cả các lớp có thể đăng ký) */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-bold text-xl mb-4 text-blue-800">Gợi ý cho bạn</h2>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {MOCK_CLASSES.map((cls) => (
            <ClassCard 
              key={cls.id}
              title={cls.title}
              base={cls.base}
              room={cls.room}
              time={cls.time}
            />
          ))}
        </div>
      </div>

      {/* Khu vực Các lớp đang học */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-bold text-xl mb-4 text-blue-800">Lớp học của tôi</h2>
        <div className="space-y-3">
          {myClasses.length > 0 ? (
            myClasses.map((cls) => (
              <div key={cls.id} className="border p-4 rounded-lg flex justify-between items-center hover:bg-gray-50">
                <div>
                  <h3 className="font-bold">{cls.title}</h3>
                  <p className="text-sm text-gray-500">{cls.room} - Cơ sở {cls.base}</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                  Đang học
                </span>
              </div>
            ))
          ) : (
             <p className="text-gray-500 italic">Bạn chưa đăng ký lớp nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
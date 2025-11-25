"use client";

import Link from 'next/link';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { MOCK_STATS } from '@/app/data/mockData';

// --- CẤU HÌNH CHART.JS (BẮT BUỘC) ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
// -------------------------------------

export default function AdminDashboardPage() {
  
  // Dữ liệu cho biểu đồ Cột (Số lượng SV - Tutor)
  const barData = {
    labels: ['Quý 1', 'Quý 2', 'Quý 3', 'Quý 4'],
    datasets: [
      {
        label: 'Sinh viên',
        data: MOCK_STATS.students,
        backgroundColor: 'rgba(74, 222, 128, 1)', // Màu xanh lá
      },
      {
        label: 'Tutor',
        data: MOCK_STATS.tutors,
        backgroundColor: 'rgba(239, 68, 68, 1)', // Màu đỏ
      },
    ],
  };

  // Dữ liệu cho biểu đồ Tròn (Phản hồi)
  const pieData = {
    labels: ['Tốt', 'Không tốt'],
    datasets: [
      {
        data: [MOCK_STATS.feedback.good, MOCK_STATS.feedback.bad],
        backgroundColor: [
          'rgba(37, 99, 235, 1)', // Xanh dương
          'rgba(220, 38, 38, 1)', // Đỏ
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cột trái: BIỂU ĐỒ (Dùng dữ liệu thật từ mockData) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Biểu đồ cột */}
          <div className="bg-white/90 p-6 rounded-lg shadow-lg">
            <h2 className="font-bold mb-4 text-blue-900">Thống kê số lượng (2026)</h2>
            <div className="h-64">
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Biểu đồ tròn */}
          <div className="bg-white/90 p-6 rounded-lg shadow-lg">
            <h2 className="font-bold mb-4 text-blue-900">Thống kê phản hồi</h2>
            <div className="h-64 flex justify-center">
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* Cột phải: LỊCH & ACTION */}
        <div className="space-y-6">
          {/* Calendar Tĩnh (Giữ nguyên hoặc nâng cấp sau) */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
             <div className="flex justify-between font-bold text-lg mb-4">
                <span>January</span><span>2025</span>
             </div>
             <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-600">
                {['S','M','T','W','T','F','S'].map(d => <span key={d}>{d}</span>)}
                {[...Array(31)].map((_, i) => (
                   <div key={i} className={`p-2 rounded hover:bg-gray-100 cursor-pointer ${i===24 ? 'bg-blue-600 text-white':''}`}>
                     {i+1}
                   </div>
                ))}
             </div>
          </div>
          
          {/* Nút Phân tích báo cáo */}
          <Link href="/admin/reports">
            <div className="bg-white/90 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-blue-50 transition border-2 border-transparent hover:border-blue-200">
              <HiOutlineClipboardList className="w-16 h-16 text-blue-800" />
              <span className="mt-4 bg-blue-800 text-white font-bold py-2 px-6 rounded-lg shadow-lg">
                PHÂN TÍCH BÁO CÁO
              </span>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
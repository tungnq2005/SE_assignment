"use client";

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight, HiX } from 'react-icons/hi';
import { format, addWeeks, subWeeks, startOfWeek, addDays, getWeek } from 'date-fns';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_SLOTS = [
  { id: '08:00', label: '08:00' },
  { id: '12:00', label: '12:00' },
  { id: '13:00', label: '13:00' },
  { id: '17:00', label: '17:00' },
  { id: '18:00', label: '18:00' },
  { id: '21:00', label: '21:00' },
];

interface AvailableSlot {
  date: string;
  time: string;
}

interface AvailabilityScheduleProps {
  onSave: (slots: AvailableSlot[]) => void;
}

export default function AvailabilitySchedule({ onSave }: AvailabilityScheduleProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [slotToCancel, setSlotToCancel] = useState<AvailableSlot | null>(null);

  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const startDateOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

  // Kiểm tra xem slot có được chọn không
  const isSlotSelected = (date: string, time: string) => {
    return availableSlots.some(slot => slot.date === date && slot.time === time);
  };

  // Thêm hoặc xóa slot
  const toggleSlot = (date: string, time: string) => {
    if (isSlotSelected(date, time)) {
      // Nếu đã chọn thì hiện modal xác nhận hủy
      setSlotToCancel({ date, time });
      setShowCancelModal(true);
    } else {
      // Nếu chưa chọn thì thêm vào
      setAvailableSlots([...availableSlots, { date, time }]);
    }
  };

  // Xác nhận hủy slot
  const confirmCancel = () => {
    if (slotToCancel) {
      setAvailableSlots(availableSlots.filter(
        slot => !(slot.date === slotToCancel.date && slot.time === slotToCancel.time)
      ));
      setShowCancelModal(false);
      setSlotToCancel(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Thông báo hướng dẫn */}
      <div className="bg-green-600 text-white p-4 rounded-2xl flex items-start space-x-3 shadow-lg">
        <div className="bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-xl shrink-0">
          !
        </div>
        <div className="flex-1">
          <p className="font-medium">
            Chọn các khung giờ bạn <strong>thường xuyên rảnh</strong> trong tuần. Đây là lịch tham khảo để sinh viên tiện liên hệ. Các buổi hỗ trợ cụ thể sẽ được tạo trong mục <strong>Lịch dạy của tôi</strong>.
          </p>
        </div>
      </div>

      {/* Header lịch động */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <h2 className="text-3xl font-bold text-blue-900 font-serif">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        
        <div className="flex items-center space-x-4 bg-gray-100 p-1 rounded-full">
          <button onClick={prevWeek} className="p-2 hover:bg-white rounded-full shadow-sm transition">
            <HiChevronLeft className="w-5 h-5 text-blue-800"/>
          </button>
          
          <span className="text-lg font-bold text-blue-900 px-2 min-w-20 text-center">
            Week {getWeek(currentDate, { weekStartsOn: 1 })}
          </span>
          
          <button onClick={nextWeek} className="p-2 hover:bg-white rounded-full shadow-sm transition">
            <HiChevronRight className="w-5 h-5 text-blue-800"/>
          </button>
        </div>
      </div>

      {/* Grid lịch */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        
        {/* Header các ngày */}
        <div className="grid grid-cols-8 border-b text-center bg-blue-50">
          <div className="border-r border-blue-100 p-3 font-bold text-blue-900">Giờ</div>
          
          {DAYS.map((dayLabel, index) => {
            const dateOfColumn = addDays(startDateOfWeek, index);
            const isToday = format(new Date(), 'dd/MM/yyyy') === format(dateOfColumn, 'dd/MM/yyyy');
            
            return (
              <div key={dayLabel} className={`border-r border-blue-100 p-2 last:border-0 ${isToday ? 'bg-blue-100' : ''}`}>
                <div className="font-bold text-blue-900">{dayLabel}</div>
                <div className={`text-sm ${isToday ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                  {format(dateOfColumn, 'dd/MM')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Các ô lịch */}
        <div className="divide-y divide-blue-100">
          {TIME_SLOTS.map((timeSlot) => (
            <div key={timeSlot.id} className="grid grid-cols-8 divide-x divide-blue-100">
              
              {/* Cột giờ */}
              <div className="flex items-center justify-center bg-blue-50 text-blue-900 p-3 font-bold">
                {timeSlot.label}
              </div>

              {/* Các ô theo ngày */}
              {DAYS.map((dayLabel, index) => {
                const dateOfColumn = addDays(startDateOfWeek, index);
                const dateStr = format(dateOfColumn, 'dd/MM/yyyy');
                const isSelected = isSlotSelected(dateStr, timeSlot.id);

                return (
                  <div
                    key={dayLabel}
                    className="relative p-3 min-h-20 group cursor-pointer transition-all"
                  >
                    {/* Background gradient khi đã chọn */}
                    <div 
                      className={`absolute inset-0 transition-all duration-300 ${
                        isSelected 
                          ? 'bg-linear-to-br from-green-400 to-green-600 opacity-100' 
                          : 'bg-blue-50/0 group-hover:bg-blue-50/50'
                      }`}
                    />

                    {/* Nút Chọn/Hủy */}
                    <div 
                      onClick={() => toggleSlot(dateStr, timeSlot.id)}
                      className="relative z-10 h-full flex items-center justify-center"
                    >
                      {isSelected ? (
                        // Hiển thị "Đã chọn" và nút Hủy khi hover
                        <div className="text-center">
                          <div className="text-white font-bold text-sm mb-1 group-hover:hidden">
                            Đã chọn
                          </div>
                          <button className="hidden group-hover:block bg-white text-red-600 px-4 py-1.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition">
                            Hủy
                          </button>
                        </div>
                      ) : (
                        // Hiển thị nút Chọn khi hover
                        <button className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg hover:bg-blue-700 transition">
                          Chọn
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Chú thích */}
      <div className="p-3 bg-white rounded-xl flex justify-center space-x-6 text-sm border shadow-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-linear-to-br from-green-400 to-green-600 mr-2 rounded"></div>
          Đã chọn (Thời gian rảnh)
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 mr-2 rounded"></div>
          Chưa chọn
        </div>
      </div>

      {/* Nút Lưu thông tin */}
      <div className="flex justify-center">
        <button
          onClick={() => onSave(availableSlots)}
          className="px-8 py-3 rounded-full font-bold text-white text-base shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
          style={{ backgroundColor: '#0313B0' }}
        >
          <span>💾</span>
          <span>Lưu lịch rảnh</span>
        </button>
      </div>

      {/* Modal xác nhận hủy */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-2xl w-[500px] p-8 shadow-2xl relative">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <HiX className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-center mb-4" style={{ color: '#0313B0' }}>
              Xác nhận hủy ?
            </h2>
            <p className="text-center text-gray-700 mb-2">
              Bạn có chắc chắn muốn hủy khung giờ này không?
            </p>
            <p className="text-center text-gray-500 text-sm mb-6">
              ({slotToCancel?.date} - {slotToCancel?.time})
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmCancel}
                className="px-6 py-2.5 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: '#0313B0' }}
              >
                Xác nhận
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-6 py-2.5 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: '#28A745' }}
              >
                Hủy thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
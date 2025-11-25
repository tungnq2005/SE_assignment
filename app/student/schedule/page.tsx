"use client";

import { useState } from 'react';
import { 
  HiOutlineSearch, HiLocationMarker, HiClock, HiUser, HiX, 
  HiCheckCircle, HiExclamation, HiCalendar 
} from 'react-icons/hi';
import { MOCK_SCHEDULE, Session } from '@/app/data/mockData';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, 
  isSameDay, isToday, getDay 
} from 'date-fns';

export default function StudentSchedulePage() {
  // --- STATE ---
  // 1. Danh sách tất cả lớp (Từ Mock Data)
  const [classes] = useState<Session[]>(MOCK_SCHEDULE);
  
  // 2. Danh sách ID các lớp ĐÃ ĐĂNG KÝ (Giả sử ban đầu đã đk lớp ID 4)
  const [registeredIds, setRegisteredIds] = useState<number[]>([4]);
  
  // 3. Bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  // 4. Quản lý trạng thái Modal
  const [modalType, setModalType] = useState<'none' | 'confirm' | 'detail' | 'success' | 'conflict' | 'full' | 'confirm-cancel'>('none');
  const [selectedClass, setSelectedClass] = useState<Session | null>(null);

  // --- COMPUTED DATA (TÍNH TOÁN DỮ LIỆU HIỂN THỊ) ---

  // Lấy ra danh sách object các lớp đã đăng ký
  const myClasses = classes.filter(c => registeredIds.includes(c.id));

  // Lọc danh sách lớp CÓ SẴN (Available)
  const availableClasses = classes.filter(c => {
    const isNotRegistered = !registeredIds.includes(c.id);
    const matchesSearch = c.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) || c.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Lọc theo ngày (nếu đang chọn ngày trên lịch)
    let matchesDate = true;
    if (filterDate) {
       // So sánh chuỗi ngày trong data (dd/MM/yyyy)
       matchesDate = c.date === format(filterDate, 'dd/MM/yyyy');
    }

    return isNotRegistered && matchesSearch && matchesDate;
  });

  // --- LOGIC XỬ LÝ ---

  // 1. Xử lý chọn ngày trên lịch
  const handleDateSelect = (date: Date) => {
    // Nếu bấm lại vào ngày đang chọn -> Bỏ lọc
    if (filterDate && isSameDay(date, filterDate)) {
       setFilterDate(null);
    } else {
       setFilterDate(date);
    }
  };

  // 2. Kiểm tra trùng lịch
  const checkConflict = (newClass: Session) => {
    // Tìm trong danh sách ĐÃ ĐĂNG KÝ xem có lớp nào trùng ngày + giờ bắt đầu không
    return myClasses.find(registered => 
      registered.date === newClass.date && 
      registered.startTime === newClass.startTime
    );
  };

  // 3. Bấm nút "Đăng ký"
  const onRegisterClick = (cls: Session) => {
    setSelectedClass(cls);

    // Case 1: Lớp đầy
    if (cls.currentStudents >= cls.maxStudents) {
      setModalType('full');
      return;
    }

    // Case 2: Trùng lịch
    const conflict = checkConflict(cls);
    if (conflict) {
      setModalType('conflict');
      return;
    }

    // Case 3: OK -> Mở popup xác nhận
    setModalType('confirm');
  };

  // 4. Xác nhận Đăng ký (Trong modal Confirm)
  const confirmRegister = () => {
    if (selectedClass) {
      setRegisteredIds([...registeredIds, selectedClass.id]);
      setModalType('success'); // Chuyển sang modal thành công
    }
  };

  // 5. Xác nhận Hủy đăng ký (Trong modal Confirm-Cancel)
  const confirmCancel = () => {
    if (selectedClass) {
      setRegisteredIds(registeredIds.filter(id => id !== selectedClass.id));
      setModalType('none');
      setSelectedClass(null);
    }
  };

  // --- RENDER GIAO DIỆN ---
  return (
    <div className="flex h-full gap-6">
      
      {/* === CỘT TRÁI (CHÍNH) === */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        
        {/* 1. SECTION: LỊCH HỌC CỦA TÔI (Đã đăng ký) */}
        <div className="bg-[#EBF4FF] p-4 rounded-3xl shadow-sm border border-blue-100 flex-shrink-0">
          <div className="flex justify-between items-center mb-3 px-2">
             <div className="flex items-center gap-2">
                <HiCalendar className="text-blue-600"/>
                <h2 className="font-bold text-gray-700 text-sm uppercase">Lớp đã đăng ký ({myClasses.length})</h2>
             </div>
          </div>
          
          <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {myClasses.map(cls => (
              <div key={cls.id} className="bg-white p-3 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md transition">
                 <div className="flex items-center gap-4">
                    <div className="bg-blue-100 px-3 py-2 rounded-xl font-bold text-blue-800 text-xs min-w-[100px] text-center">
                       {cls.subject}
                    </div>
                    <div>
                       <p className="text-sm font-bold text-gray-800">{cls.tutorName}</p>
                       <div className="flex items-center text-xs text-gray-500 gap-2 mt-1">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{cls.date}</span>
                          <span>{cls.startTime} - {cls.endTime}</span>
                       </div>
                    </div>
                 </div>
                 <button 
                   onClick={() => { setSelectedClass(cls); setModalType('detail'); }}
                   className="bg-black text-white text-xs px-4 py-2 rounded-full font-bold hover:bg-gray-800 transition"
                 >
                   Xem thông tin
                 </button>
              </div>
            ))}
            {myClasses.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">Bạn chưa đăng ký lớp nào.</p>}
          </div>
        </div>

        {/* 2. SECTION: TÌM KIẾM & ĐĂNG KÝ (Available) */}
        <div className="bg-[#475569] p-6 rounded-[32px] flex-1 shadow-lg flex flex-col min-h-0">
           
           {/* Thanh tìm kiếm */}
           <div className="relative mb-6 flex-shrink-0">
              <HiOutlineSearch className="absolute left-5 top-4 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Tìm kiếm theo môn học hoặc tên Tutor..." 
                className="w-full pl-12 pr-4 py-3.5 rounded-full outline-none text-gray-700 font-medium shadow-md bg-white/95 focus:bg-white transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>

           {/* Grid hiển thị lớp học */}
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar">
              {availableClasses.map(cls => (
                <div key={cls.id} className="bg-[#D1D5DB] p-5 rounded-3xl relative group hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl">
                   <div className="flex justify-between items-start">
                      <h3 className="font-bold text-xl text-gray-900 mb-1">{cls.subject}</h3>
                      <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded text-gray-600">{cls.type}</span>
                   </div>
                   
                   <div className="space-y-2.5 mt-4 text-gray-700 text-sm font-medium">
                      <div className="flex items-center"><HiUser className="w-4 h-4 mr-2 text-gray-500"/> <span className="text-gray-900">{cls.tutorName}</span></div>
                      <div className="flex items-center"><HiLocationMarker className="w-4 h-4 mr-2 text-gray-500"/> {cls.location} {cls.base && `(CS${cls.base})`}</div>
                      <div className="flex items-center"><HiClock className="w-4 h-4 mr-2 text-gray-500"/> {cls.startTime} - {cls.endTime}</div>
                      
                      {/* Progress Bar sĩ số */}
                      <div className="flex items-center gap-2 mt-2">
                         <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                            <div 
                               className={`h-full rounded-full ${cls.currentStudents >= cls.maxStudents ? 'bg-red-500' : 'bg-green-500'}`} 
                               style={{ width: `${(cls.currentStudents/cls.maxStudents)*100}%` }}
                            ></div>
                         </div>
                         <span className="text-xs text-gray-500">{cls.currentStudents}/{cls.maxStudents}</span>
                      </div>
                   </div>
                   
                   <button 
                     onClick={() => onRegisterClick(cls)}
                     className="mt-5 w-full bg-black text-white py-2.5 rounded-full font-bold hover:bg-gray-800 shadow-lg transition transform active:scale-95"
                   >
                     Đăng ký
                   </button>
                </div>
              ))}
              
              {availableClasses.length === 0 && (
                <div className="col-span-full text-center text-gray-300 py-20 flex flex-col items-center">
                   <HiExclamation className="w-10 h-10 mb-2 opacity-50"/>
                   <p>Không tìm thấy lớp học phù hợp.</p>
                   {filterDate && <button onClick={() => setFilterDate(null)} className="text-blue-300 underline mt-2">Xóa lọc ngày</button>}
                </div>
              )}
           </div>
        </div>
      </div>

      {/* === CỘT PHẢI (CALENDAR) === */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-6">
         {/* Component Lịch */}
         <MiniCalendar selectedDate={filterDate} onDateSelect={handleDateSelect} />

         {/* Thông tin trạng thái */}
         <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex-1 h-fit">
            <h3 className="font-bold text-gray-400 text-xs uppercase mb-3 tracking-wider">Trạng thái lọc</h3>
            {filterDate ? (
               <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-800">
                  <p className="font-bold text-lg">{format(filterDate, 'dd/MM')}</p>
                  <p className="text-sm">Tìm thấy <span className="font-bold">{availableClasses.length}</span> lớp.</p>
                  <button onClick={() => setFilterDate(null)} className="text-xs underline mt-2 text-blue-600 hover:text-blue-800">Xóa lọc</button>
               </div>
            ) : (
               <div className="text-gray-500 text-sm">
                  Đang hiển thị tất cả các lớp học sắp tới. Chọn một ngày trên lịch để lọc nhanh.
               </div>
            )}
         </div>
      </div>


      {/* ================= MODALS (POP-UPS) ================= */}
      
      {/* 1. CONFIRM REGISTER */}
      {modalType === 'confirm' && selectedClass && (
        <PopupWrapper onClose={() => setModalType('none')}>
           <div className="text-center pt-2">
              <h3 className="text-blue-900 font-bold text-2xl mb-2 font-serif">Xác nhận đăng ký?</h3>
              <p className="text-gray-600 mb-8 px-4">
                 Bạn có chắc chắn muốn đăng ký lớp <br/>
                 <span className="font-bold text-black text-lg">{selectedClass.subject}</span><br/>
                 vào lúc <span className="font-bold text-blue-600">{selectedClass.startTime} - {selectedClass.date}</span> không?
              </p>
              <div className="flex justify-center gap-4">
                 <button onClick={confirmRegister} className="bg-blue-800 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-900 shadow-lg shadow-blue-200 transition">Xác nhận</button>
                 <button onClick={() => setModalType('none')} className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 shadow-lg shadow-green-200 transition">Hủy</button>
              </div>
           </div>
        </PopupWrapper>
      )}

      {/* 2. SUCCESS NOTIFICATION (Góc dưới) */}
      {modalType === 'success' && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
           <div className="bg-[#DCFCE7] border border-green-400 text-green-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 pr-10 relative">
              <div className="bg-green-500 rounded-full p-1">
                <HiCheckCircle className="w-6 h-6 text-white"/>
              </div>
              <div>
                 <h4 className="font-bold text-lg">Thành công</h4>
                 <p className="text-sm font-medium opacity-90">Đăng ký thành công!</p>
              </div>
              <button onClick={() => setModalType('none')} className="absolute top-2 right-2 p-1 hover:bg-green-200 rounded-full"><HiX className="w-4 h-4"/></button>
           </div>
        </div>
      )}

      {/* 3. CONFLICT WARNING (Góc dưới) */}
      {modalType === 'conflict' && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
           <div className="bg-[#FEF9C3] border border-yellow-400 text-yellow-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 pr-10 relative w-[400px]">
              <div className="bg-yellow-500 rounded-full p-1 flex-shrink-0">
                 <HiExclamation className="w-6 h-6 text-white"/>
              </div>
              <div>
                 <h4 className="font-bold text-lg">Cảnh báo trùng lịch</h4>
                 <p className="text-sm font-medium opacity-90">Bạn đã có lịch học khác vào khung giờ này. Vui lòng kiểm tra lại.</p>
              </div>
              <button onClick={() => setModalType('none')} className="absolute top-2 right-2 p-1 hover:bg-yellow-200 rounded-full"><HiX className="w-4 h-4"/></button>
           </div>
        </div>
      )}

      {/* 4. CLASS FULL WARNING */}
      {modalType === 'full' && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
           <div className="bg-red-100 border border-red-400 text-red-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 pr-10 relative">
              <div className="bg-red-500 rounded-full p-1">
                 <HiExclamation className="w-6 h-6 text-white"/>
              </div>
              <div>
                 <h4 className="font-bold text-lg">Lớp đã đầy</h4>
                 <p className="text-sm font-medium opacity-90">Lớp học này đã đủ sĩ số.</p>
              </div>
              <button onClick={() => setModalType('none')} className="absolute top-2 right-2 p-1 hover:bg-red-200 rounded-full"><HiX className="w-4 h-4"/></button>
           </div>
        </div>
      )}

      {/* 5. DETAIL MODAL (Xem chi tiết & Hủy) */}
      {modalType === 'detail' && selectedClass && (
        <PopupWrapper onClose={() => setModalType('none')} title="Chi tiết buổi học">
           <div className="space-y-4 text-gray-700 px-4">
              <InfoRow label="Chủ đề" value={selectedClass.subject} />
              <InfoRow label="Tutor" value={selectedClass.tutorName} highlight />
              <div className="flex gap-4">
                 <InfoRow label="Ngày" value={selectedClass.date} isDate />
                 <InfoRow label="Giờ" value={`${selectedClass.startTime}`} isBox />
              </div>
              <InfoRow label="Hình thức" value={selectedClass.type === 'online' ? 'Trực tuyến' : 'Trực tiếp (Offline)'} />
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                 <InfoRow label="Địa điểm" value={selectedClass.location} />
                 {selectedClass.base && <InfoRow label="Cơ sở" value={`Cơ sở ${selectedClass.base}`} />}
              </div>
              
              <InfoRow label="Trạng thái" value={`${selectedClass.currentStudents}/${selectedClass.maxStudents} học viên`} />
           </div>
           
           <div className="mt-8 flex justify-center">
              <button 
                onClick={() => setModalType('confirm-cancel')} 
                className="bg-red-100 text-red-700 font-bold py-3 px-10 rounded-full hover:bg-red-200 transition border border-red-200"
              >
                Hủy đăng ký
              </button>
           </div>
        </PopupWrapper>
      )}

      {/* 6. CONFIRM CANCEL MODAL */}
      {modalType === 'confirm-cancel' && (
         <PopupWrapper onClose={() => setModalType('detail')}>
            <div className="text-center pt-2">
               <h3 className="text-blue-900 font-bold text-2xl mb-2 font-serif">Xác nhận hủy?</h3>
               <p className="text-gray-600 mb-8 px-6">
                  Bạn có chắc chắn muốn hủy đăng ký buổi học này không? <br/>Hành động này sẽ giải phóng chỗ cho sinh viên khác.
               </p>
               <div className="flex justify-center gap-4">
                  <button onClick={confirmCancel} className="bg-blue-800 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-900 shadow-lg shadow-blue-200">Xác nhận</button>
                  <button onClick={() => setModalType('detail')} className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 shadow-lg shadow-green-200">Giữ lại</button>
               </div>
            </div>
         </PopupWrapper>
      )}

    </div>
  );
}

// --- SUB COMPONENTS (Internal) ---

// 1. Mini Calendar Component
const MiniCalendar = ({ selectedDate, onDateSelect }: { selectedDate: Date | null, onDateSelect: (d: Date) => void }) => {
   const [viewDate, setViewDate] = useState(new Date());
   const nextMonth = () => setViewDate(addMonths(viewDate, 1));
   const prevMonth = () => setViewDate(subMonths(viewDate, 1));

   const days = eachDayOfInterval({ 
      start: startOfWeek(startOfMonth(viewDate)), 
      end: endOfWeek(endOfMonth(viewDate)) 
   });

   return (
      <div className="bg-[#E5E5E5] p-5 rounded-[32px] shadow-sm select-none">
         <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-2xl font-bold text-black font-serif">{format(viewDate, 'MMMM')}</h2>
            <div className="flex items-center gap-2">
               <button onClick={prevMonth} className="hover:bg-gray-300 rounded p-1">◀</button>
               <span className="font-bold text-gray-600">{format(viewDate, 'yyyy')}</span>
               <button onClick={nextMonth} className="hover:bg-gray-300 rounded p-1">▶</button>
            </div>
         </div>
         
         <div className="bg-[#B91C1C] text-white rounded-xl py-2 px-1 mb-3 shadow-inner">
            <div className="grid grid-cols-7 text-center text-xs font-bold uppercase tracking-wider">
               {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
            </div>
         </div>

         <div className="grid grid-cols-7 gap-1.5 text-center">
            {days.map((day, i) => {
               const isSelected = selectedDate && isSameDay(day, selectedDate);
               const isCurrentMonth = isSameMonth(day, viewDate);
               const isTodayDate = isToday(day);

               return (
                  <div 
                     key={i} onClick={() => onDateSelect(day)}
                     className={`
                        w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium mx-auto cursor-pointer transition-all duration-200
                        ${!isCurrentMonth ? 'text-gray-400 opacity-50' : 'text-gray-700'} 
                        ${isSelected ? 'bg-black text-white shadow-lg scale-110' : 'hover:bg-white'}
                        ${!isSelected && isTodayDate ? 'border-2 border-red-600 font-bold text-red-600' : ''}
                     `}
                  >
                     {format(day, 'd')}
                  </div>
               );
            })}
         </div>
      </div>
   );
};

// 2. Popup Wrapper
const PopupWrapper = ({ children, onClose, title }: any) => (
   <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-[32px] p-8 w-[500px] shadow-2xl relative transform transition-all scale-100 border-4 border-white/20">
         <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full p-2 transition">
            <HiX className="w-6 h-6"/>
         </button>
         {title && <h2 className="text-center text-3xl font-bold text-blue-900 mb-8 font-serif">{title}</h2>}
         {children}
      </div>
   </div>
);

// 3. Info Row
const InfoRow = ({ label, value, isBox, isDate, highlight }: any) => (
   <div className="flex items-center mb-3">
     <span className="font-bold text-blue-900 w-28 flex-shrink-0 text-sm uppercase tracking-wide opacity-80">{label}</span>
     {isBox ? (
        <span className="border-2 border-blue-900 text-blue-900 px-3 py-0.5 rounded-lg font-bold tracking-widest bg-blue-50">{value}</span>
     ) : isDate ? (
        <span className="font-bold text-blue-900 tracking-widest border-2 border-blue-200 bg-blue-50 px-2 rounded-lg">{value}</span>
     ) : (
        <span className={`font-medium text-lg ${highlight ? 'text-black font-bold' : 'text-gray-700'}`}>{value}</span>
     )}
   </div>
 );
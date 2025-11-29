"use client";

import { useState } from 'react';
// Import các icon
import { 
  HiOutlineSearch, HiLocationMarker, HiClock, HiUser, HiX, 
  HiCheckCircle, HiExclamation, HiCalendar, HiFilter, HiViewList, HiViewBoards 
} from 'react-icons/hi';
// Import dữ liệu giả
import { MOCK_SCHEDULE, Session } from '@/app/data/mockData';
// Import thư viện xử lý ngày tháng (đảm bảo bạn đã npm install date-fns)
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, 
  isSameDay, isToday, getDay, addDays 
} from 'date-fns';

// =============================================================================
// COMPONENT CHÍNH: TRANG LỊCH CỦA SINH VIÊN
// =============================================================================
export default function StudentSchedulePage() {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [classes] = useState<Session[]>(MOCK_SCHEDULE);
  // Giả sử đã đăng ký lớp ID 1 và 4
  const [registeredIds, setRegisteredIds] = useState<number[]>([1, 4]); 
  
  // State tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<Date | null>(new Date()); // Ngày đang chọn
  const [viewType, setViewType] = useState<'day' | 'week'>('day'); // Chế độ xem: Ngày / Tuần

  // State quản lý Modal (Popup)
  const [modalType, setModalType] = useState<'none' | 'confirm' | 'detail' | 'success' | 'conflict' | 'full' | 'confirm-cancel'>('none');
  const [selectedClass, setSelectedClass] = useState<Session | null>(null);

  // --- LOGIC TÍNH TOÁN DỮ LIỆU (COMPUTED) ---

  // 1. Tính toán ngày cho View Tuần
  // Lấy ngày đầu tuần (Thứ 2) dựa trên ngày đang chọn (filterDate) hoặc hôm nay
  const currentWeekStart = startOfWeek(filterDate || new Date(), { weekStartsOn: 1 }); 
  const weekDays = Array.from({ length: 7 }).map((_, index) => addDays(currentWeekStart, index));

  // 2. Helper: Kiểm tra lớp học có diễn ra vào ngày 'date' không
  const isClassOnDate = (cls: Session, date: Date | null) => {
    if (!date) return true;
    // So sánh chuỗi ngày trong data (dd/MM/yyyy) với ngày đang chọn
    return cls.date === format(date, 'dd/MM/yyyy'); 
  };

  // 3. Lọc danh sách "Lớp đã đăng ký" (My Classes)
  const myRegisteredClasses = classes.filter(c => registeredIds.includes(c.id));

  // 4. Lọc danh sách "Lớp có sẵn để đăng ký" (Available Classes)
  const availableClasses = classes
    .filter(c => !registeredIds.includes(c.id)) // Chưa đăng ký
    .filter(c => 
       c.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       c.subject.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.startTime.localeCompare(b.startTime)); // Sắp xếp theo giờ

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN (HANDLERS) ---

  // Chọn ngày trên lịch nhỏ
  const handleDateSelect = (date: Date) => {
    setFilterDate(date);
  };

  // Kiểm tra trùng lịch
  const checkConflict = (newClass: Session) => {
    return myRegisteredClasses.find(registered => 
        registered.date === newClass.date && // Cùng ngày
        (
          // Logic trùng giờ: (Start A < End B) và (Start B < End A)
          (newClass.startTime < registered.endTime && registered.startTime < newClass.endTime)
        )
      );
  };

  // Bấm nút Đăng ký
  const onRegisterClick = (cls: Session) => {
    setSelectedClass(cls);
    if (cls.currentStudents >= cls.maxStudents) { setModalType('full'); return; }
    if (checkConflict(cls)) { setModalType('conflict'); return; }
    setModalType('confirm');
  };

  // Xác nhận Đăng ký
  const confirmRegister = () => {
    if (selectedClass) {
      setRegisteredIds([...registeredIds, selectedClass.id]);
      setModalType('success');
    }
  };

  // Xác nhận Hủy đăng ký
  const confirmCancel = () => {
    if (selectedClass) {
      setRegisteredIds(registeredIds.filter(id => id !== selectedClass.id));
      setModalType('none');
      setSelectedClass(null);
    }
  };

  // --- RENDER GIAO DIỆN CHÍNH ---
  return (
    <div className="flex h-full gap-6">
      
      {/* === CỘT TRÁI (DANH SÁCH LỚP) === */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        
        {/* --- PHẦN 1: LỊCH HỌC CỦA TÔI --- */}
        <div className="bg-[#EBF4FF] p-5 rounded-3xl shadow-sm border border-blue-100 flex-shrink-0 flex flex-col max-h-[500px]">
          
          {/* Header & Nút chuyển View */}
          <div className="flex justify-between items-center mb-4 px-1">
             <div className="flex items-center gap-2">
                <HiCalendar className="text-blue-600 w-5 h-5"/>
                <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                  {viewType === 'day' 
                    ? `Lịch ngày ${filterDate ? format(filterDate, 'dd/MM/yyyy') : '...'}`
                    : `Tuần ${format(currentWeekStart, 'dd/MM')} - ${format(endOfWeek(currentWeekStart, {weekStartsOn: 1}), 'dd/MM')}`
                  }
                </h2>
             </div>

             <div className="bg-white p-1 rounded-lg border flex text-xs font-bold shadow-sm">
                <button 
                  onClick={() => setViewType('day')}
                  className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${viewType === 'day' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <HiViewList className="w-3 h-3"/> Ngày
                </button>
                <button 
                  onClick={() => setViewType('week')}
                  className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${viewType === 'week' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <HiViewBoards className="w-3 h-3"/> Tuần
                </button>
             </div>
          </div>
          
          {/* Nội dung danh sách (Cuộn được) */}
          <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
            
            {/* --- VIEW 1: THEO NGÀY --- */}
            {viewType === 'day' && (
              <div className="space-y-3">
                {myRegisteredClasses.filter(c => isClassOnDate(c, filterDate)).length > 0 ? (
                  myRegisteredClasses
                    .filter(c => isClassOnDate(c, filterDate))
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map(cls => (
                      <ClassItem key={cls.id} cls={cls} onDetail={() => { setSelectedClass(cls); setModalType('detail'); }} />
                    ))
                ) : (
                  <EmptyState text="Không có lịch học nào vào ngày này." />
                )}
              </div>
            )}

            {/* --- VIEW 2: THEO TUẦN --- */}
            {viewType === 'week' && (
              <div className="space-y-4">
                {weekDays.map((dayDate, index) => {
                  const dateStr = format(dayDate, 'dd/MM/yyyy');
                  // Tìm lớp trùng ngày
                  const classesToday = myRegisteredClasses
                    .filter(c => c.date === dateStr)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime));
                  
                  const isTodayHighlight = isToday(dayDate);

                  return (
                    <div key={index} className={`rounded-xl border ${isTodayHighlight ? 'bg-white border-blue-300 shadow-md ring-1 ring-blue-200' : 'border-transparent'}`}>
                      {/* Header Ngày */}
                      <div className={`px-3 py-2 text-sm font-bold flex items-center gap-2 ${isTodayHighlight ? 'text-blue-700' : 'text-gray-500'}`}>
                        <span className="w-20">{format(dayDate, 'EEEE')}</span>
                        <span className="opacity-75 font-normal">{dateStr}</span>
                        {classesToday.length > 0 && <span className="ml-auto bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px]">{classesToday.length} tiết</span>}
                      </div>

                      {/* List lớp */}
                      <div className="space-y-2 px-2 pb-2">
                        {classesToday.length > 0 ? (
                          classesToday.map(cls => (
                            <ClassItem key={cls.id} cls={cls} onDetail={() => { setSelectedClass(cls); setModalType('detail'); }} mini />
                          ))
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* --- PHẦN 2: TÌM VÀ ĐĂNG KÝ --- */}
        <div className="bg-[#475569] p-6 rounded-[32px] flex-1 shadow-lg flex flex-col min-h-0 relative overflow-hidden">
           {/* Trang trí */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

           {/* Input Search */}
           <div className="relative mb-6 flex-shrink-0 z-10">
              <HiOutlineSearch className="absolute left-5 top-4 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Tìm lớp học hoặc Tutor..." className="w-full pl-12 pr-4 py-3.5 rounded-full outline-none text-gray-700 font-medium shadow-lg bg-white/95 focus:bg-white transition" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
           </div>

           {/* Grid lớp học available */}
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar z-10 pb-4">
              {availableClasses.map(cls => (
                <div key={cls.id} className="bg-gray-200 p-5 rounded-3xl group hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl">
                   <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">{cls.subject}</h3>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${cls.type === 'online' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{cls.type}</span>
                   </div>
                   <div className="space-y-2 text-gray-700 text-sm font-medium">
                      <div className="flex items-center"><HiUser className="w-4 h-4 mr-2 opacity-60"/> {cls.tutorName}</div>
                      <div className="flex items-center gap-2"><HiClock className="w-4 h-4 mr-2 opacity-60"/> <span>{cls.startTime} - {cls.endTime}</span></div>
                      <div className="text-xs text-gray-500 mt-1">{cls.date}</div>
                   </div>
                   <button onClick={() => onRegisterClick(cls)} className="mt-4 w-full bg-black text-white py-2.5 rounded-full font-bold hover:bg-gray-800 shadow-lg transition active:scale-95 flex justify-center items-center gap-2"><span>Đăng ký</span><HiCheckCircle className="w-4 h-4 opacity-50"/></button>
                </div>
              ))}
              {availableClasses.length === 0 && <div className="col-span-full text-center text-gray-300 py-10">Không tìm thấy lớp học phù hợp.</div>}
           </div>
        </div>
      </div>

      {/* === CỘT PHẢI (CALENDAR WIDGET) === */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-6">
         {/* Gọi component con, truyền props filterDate */}
         <MiniCalendar selectedDate={filterDate} onDateSelect={handleDateSelect} />
      </div>

      {/* === MODALS === */}
      <ScheduleModals modalType={modalType} setModalType={setModalType} selectedClass={selectedClass} confirmRegister={confirmRegister} confirmCancel={confirmCancel} />
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTS (Được định nghĩa bên ngoài để tránh lỗi render/scope)
// =============================================================================

// 1. Class Item (Thẻ hiển thị lớp học)
const ClassItem = ({ cls, onDetail, mini }: { cls: Session, onDetail: () => void, mini?: boolean }) => (
  <div className={`bg-white p-3 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md border border-transparent hover:border-blue-200 transition ${mini ? 'py-2' : ''}`}>
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`flex flex-col items-center justify-center bg-blue-50 rounded-xl border border-blue-100 flex-shrink-0 ${mini ? 'w-12 h-10' : 'w-16 h-12'}`}>
            <span className={`text-blue-900 font-bold ${mini ? 'text-xs' : 'text-sm'}`}>{cls.startTime}</span>
            {!mini && <span className="text-blue-400 text-[10px] font-bold">{cls.day}</span>}
        </div>
        <div className="min-w-0">
            <h3 className={`font-bold text-gray-800 truncate ${mini ? 'text-xs' : 'text-sm'}`}>{cls.subject}</h3>
            <div className="flex items-center text-xs text-gray-500 gap-2 mt-0.5 truncate">
              <span className="flex items-center truncate"><HiUser className="w-3 h-3 mr-1 flex-shrink-0"/>{cls.tutorName}</span>
              {!mini && <span className="flex items-center"><HiLocationMarker className="w-3 h-3 mr-1"/>{cls.location}</span>}
            </div>
        </div>
      </div>
      <button onClick={onDetail} className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition"><HiFilter className="w-4 h-4 rotate-180" /></button>
  </div>
);

// 2. Empty State
const EmptyState = ({ text }: { text: string }) => (
  <div className="text-center py-6 bg-white/50 rounded-2xl border border-dashed border-blue-200">
    <p className="text-gray-500 text-sm italic">{text}</p>
  </div>
);

// 3. Mini Calendar
const MiniCalendar = ({ selectedDate, onDateSelect }: { selectedDate: Date | null, onDateSelect: (d: Date) => void }) => {
   const [viewDate, setViewDate] = useState(new Date());
   const nextMonth = () => setViewDate(addMonths(viewDate, 1));
   const prevMonth = () => setViewDate(subMonths(viewDate, 1));
   const days = eachDayOfInterval({ start: startOfWeek(startOfMonth(viewDate)), end: endOfWeek(endOfMonth(viewDate)) });

   return (
      <div className="bg-[#E5E5E5] p-5 rounded-[32px] shadow-sm select-none">
         <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-2xl font-bold text-black font-serif">{format(viewDate, 'MMMM')}</h2>
            <div className="flex gap-2">
               <button onClick={prevMonth} className="hover:bg-white p-1 rounded transition">◀</button>
               <span className="font-bold text-gray-600 self-center">{format(viewDate, 'yyyy')}</span>
               <button onClick={nextMonth} className="hover:bg-white p-1 rounded transition">▶</button>
            </div>
         </div>
         <div className="bg-[#B91C1C] text-white rounded-xl py-2 px-1 mb-3">
            <div className="grid grid-cols-7 text-center text-xs font-bold uppercase">{['S','M','T','W','T','F','S'].map((d,i)=><div key={i}>{d}</div>)}</div>
         </div>
         <div className="grid grid-cols-7 gap-1.5 text-center">
            {days.map((day, i) => {
               const isSelected = selectedDate && isSameDay(day, selectedDate);
               const isCurrentMonth = isSameMonth(day, viewDate);
               const isTodayDate = isToday(day);
               return (
                  <div key={i} onClick={() => onDateSelect(day)} className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium mx-auto cursor-pointer transition-all ${!isCurrentMonth ? 'text-gray-400 opacity-30' : 'text-gray-700'} ${isSelected ? 'bg-black text-white shadow-lg scale-110' : 'hover:bg-white'} ${!isSelected && isTodayDate ? 'border-2 border-red-600 font-bold text-red-600' : ''}`}>{format(day, 'd')}</div>
               );
            })}
         </div>
         {selectedDate && <div className="text-center mt-4 text-xs text-gray-500">Đang lọc: <span className="font-bold text-black">{format(selectedDate, 'dd/MM/yyyy')}</span></div>}
      </div>
   );
};

// 4. Schedule Modals Container
const ScheduleModals = ({ modalType, setModalType, selectedClass, confirmRegister, confirmCancel }: any) => {
  if (modalType === 'none') return null;
  const Wrapper = ({ children, title }: any) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in p-4">
      <div className="bg-white rounded-[32px] p-8 w-[500px] shadow-2xl relative animate-scale-up">
         <button onClick={() => setModalType('none')} className="absolute top-5 right-5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full p-2 transition"><HiX className="w-6 h-6"/></button>
         {title && <h2 className="text-center text-3xl font-bold text-blue-900 mb-6 font-serif">{title}</h2>}
         {children}
      </div>
    </div>
  );
  const InfoRow = ({ label, value, isBox, isDate, highlight }: any) => (
    <div className="flex items-center mb-3">
      <span className="font-bold text-blue-900 w-28 flex-shrink-0 text-sm uppercase tracking-wide opacity-80">{label}</span>
      {isBox ? <span className="border-2 border-blue-900 text-blue-900 px-3 py-0.5 rounded-lg font-bold tracking-widest bg-blue-50">{value}</span> : isDate ? <span className="font-bold text-blue-900 tracking-widest border-2 border-blue-200 bg-blue-50 px-2 rounded-lg">{value}</span> : <span className={`font-medium text-lg ${highlight ? 'text-black font-bold' : 'text-gray-700'}`}>{value}</span>}
    </div>
  );

  return (
    <>
      {modalType === 'confirm' && selectedClass && (
        <Wrapper>
           <div className="text-center"><h3 className="text-blue-900 font-bold text-2xl mb-2 font-serif">Xác nhận đăng ký?</h3><p className="text-gray-600 mb-8">Bạn có chắc chắn muốn đăng ký lớp <br/><span className="font-bold text-black">{selectedClass.subject}</span> không?</p><div className="flex justify-center gap-4"><button onClick={confirmRegister} className="bg-blue-800 text-white font-bold py-3 px-8 rounded-full shadow-lg">Xác nhận</button><button onClick={() => setModalType('none')} className="bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg">Hủy</button></div></div>
        </Wrapper>
      )}
      {modalType === 'success' && (<div className="fixed bottom-6 right-6 z-50 animate-bounce-in bg-[#DCFCE7] border border-green-400 text-green-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"><HiCheckCircle className="w-8 h-8 text-green-600"/><div><h4 className="font-bold text-lg">Thành công</h4><p className="text-sm">Đăng ký thành công!</p></div><button onClick={() => setModalType('none')}><HiX className="w-5 h-5"/></button></div>)}
      {modalType === 'conflict' && (<div className="fixed bottom-6 right-6 z-50 animate-bounce-in bg-[#FEF9C3] border border-yellow-400 text-yellow-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"><HiExclamation className="w-8 h-8 text-yellow-600"/><div><h4 className="font-bold text-lg">Cảnh báo</h4><p className="text-sm">Trùng lịch học!</p></div><button onClick={() => setModalType('none')}><HiX className="w-5 h-5"/></button></div>)}
      {modalType === 'full' && (<div className="fixed bottom-6 right-6 z-50 animate-bounce-in bg-red-100 border border-red-400 text-red-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"><HiExclamation className="w-8 h-8 text-white bg-red-500 rounded-full p-1"/><div><h4 className="font-bold text-lg">Lớp đầy</h4><p className="text-sm">Sĩ số đã đủ.</p></div><button onClick={() => setModalType('none')}><HiX className="w-5 h-5"/></button></div>)}
      {modalType === 'detail' && selectedClass && (
        <Wrapper title="Chi tiết buổi học">
           <div className="space-y-4 text-gray-700 px-2"><InfoRow label="Chủ đề" value={selectedClass.subject} /><InfoRow label="Tutor" value={selectedClass.tutorName} highlight /><div className="flex gap-4"><InfoRow label="Ngày" value={selectedClass.date} isDate /><InfoRow label="Giờ" value={`${selectedClass.startTime}`} isBox /></div><InfoRow label="Hình thức" value={selectedClass.type} /><div className="bg-gray-50 p-4 rounded-xl border border-gray-200"><InfoRow label="Địa điểm" value={selectedClass.location} />{selectedClass.base && <InfoRow label="Cơ sở" value={`Cơ sở ${selectedClass.base}`} />}</div><InfoRow label="Trạng thái" value={`${selectedClass.currentStudents}/${selectedClass.maxStudents} học viên`} /></div><div className="mt-8 flex justify-center"><button onClick={() => setModalType('confirm-cancel')} className="bg-red-100 text-red-600 font-bold py-3 px-10 rounded-full hover:bg-red-200">Hủy đăng ký</button></div>
        </Wrapper>
      )}
      {modalType === 'confirm-cancel' && (<Wrapper><div className="text-center pt-2"><h3 className="text-blue-900 font-bold text-2xl mb-2 font-serif">Xác nhận hủy?</h3><p className="text-gray-600 mb-8 px-6">Bạn có chắc chắn muốn hủy đăng ký buổi học này không?</p><div className="flex justify-center gap-4"><button onClick={confirmCancel} className="bg-blue-800 text-white font-bold py-3 px-8 rounded-full shadow-lg">Xác nhận</button><button onClick={() => setModalType('detail')} className="bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg">Giữ lại</button></div></div></Wrapper>)}
    </>
  );
};
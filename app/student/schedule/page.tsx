"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  HiOutlineSearch, HiLocationMarker, HiClock, HiUser, HiX, 
  HiCheckCircle, HiExclamation, HiCalendar 
} from 'react-icons/hi';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, 
  isSameDay, isToday, parseISO 
} from 'date-fns';

const BASE_URL = 'http://localhost:5000/api/students'; // Cập nhật port BE của bạn

// Interface khớp với dữ liệu sau khi map từ BE
interface Session {
  id: number;
  subject: string;
  tutorName: string;
  date: string;       // dd/MM/yyyy
  rawDate: string;    // YYYY-MM-DD (để lọc)
  startTime: string;
  endTime: string;
  location: string;
  base?: string;
  currentStudents: number;
  maxStudents: number;
  type: 'online' | 'offline';
  isRegistered: boolean; // Field quan trọng để phân loại
}

export default function StudentSchedulePage() {
  // --- STATE ---
  const [availableSessions, setAvailableSessions] = useState<Session[]>([]);
  const [mySessions, setMySessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  // Modal State
  const [modalType, setModalType] = useState<'none' | 'confirm' | 'detail' | 'success' | 'conflict' | 'full' | 'confirm-cancel'>('none');
  const [selectedClass, setSelectedClass] = useState<Session | null>(null);

  // --- API HELPERS ---

  // Hàm chuyển đổi data từ BE (PascalCase/SnakeCase) -> FE (CamelCase)
  const mapBeToFe = (item: any): Session => {
    // Xử lý Date: BE trả về YYYY-MM-DD hoặc ISO
    // Cần cẩn thận múi giờ, ở đây dùng string split cho an toàn nếu BE trả về YYYY-MM-DD
    const dateStr = typeof item.Date === 'string' ? item.Date.split('T')[0] : '';
    const [y, m, d] = dateStr.split('-');
    const formattedDate = `${d}/${m}/${y}`;

    return {
      id: item.SessionID,
      subject: item.Topic,
      tutorName: item.TutorName || item.tutor_name || "Giảng viên",
      date: formattedDate,
      rawDate: dateStr,
      startTime: item.StartTime?.slice(0, 5) || "",
      endTime: item.EndTime?.slice(0, 5) || "",
      location: item.Location,
      base: item.Base,
      // BE trả về string cho count trong 1 số trường hợp COUNT(), cần ép kiểu
      currentStudents: Number(item.CurrentStudents || item.enrolled_students || 0),
      maxStudents: item.MaxStudent,
      type: (item.Format === 'Online' || item.Format === 'online') ? 'online' : 'offline',
      isRegistered: false
    };
  };

  // 1. Fetch dữ liệu
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        toast.error("Vui lòng đăng nhập lại");
        return;
    }

    try {
      setLoading(true);
      // Gọi song song 2 API: Lấy lớp có sẵn (Search) và Lớp đã đăng ký (My Schedule)
      // Lưu ý: Bạn cần chắc chắn đã thêm route /sessions/available như Bước 1
      const [resAvailable, resMe] = await Promise.all([
         axios.get(`${BASE_URL}/sessions/available`, { headers: { Authorization: `Bearer ${token}` } }),
         axios.get(`${BASE_URL}/sessions/me`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      // Xử lý list Available (Tất cả lớp đang mở)
      const allOpen = resAvailable.data.map(mapBeToFe);
      
      // Xử lý list My Sessions (Lớp mình đã đk)
      // API viewSchedule trả về { success, count, data: [] }
      const myRegs = resMe.data.data.map(mapBeToFe);

      setAvailableSessions(allOpen);
      setMySessions(myRegs);

    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      // Nếu API available chưa có, tạm thời để trống để ko crash trang
      setAvailableSessions([]); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  // --- COMPUTED DATA ---
  
  // Lọc danh sách hiển thị ở cột Giữa (Chỉ hiện lớp chưa đăng ký + khớp bộ lọc)
  const filteredAvailable = availableSessions.filter(c => {
    const matchesSearch = c.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Logic lọc ngày
    let matchesDate = true;
    if (filterDate) {
       matchesDate = c.rawDate === format(filterDate, 'yyyy-MM-dd');
    }

    // Chỉ còn 2 điều kiện này
    return matchesSearch && matchesDate;
  });

  // --- HANDLERS ---

  const handleDateSelect = (date: Date) => {
    if (filterDate && isSameDay(date, filterDate)) {
       setFilterDate(null);
    } else {
       setFilterDate(date);
    }
  };

  // Kiểm tra trùng lịch (FE Check sơ bộ)
  const checkConflict = (newClass: Session) => {
    return mySessions.find(registered => 
      registered.rawDate === newClass.rawDate && 
      registered.startTime === newClass.startTime
    );
  };

  const onRegisterClick = (cls: Session) => {
    setSelectedClass(cls);

    if (cls.currentStudents >= cls.maxStudents) {
      setModalType('full');
      return;
    }
    const conflict = checkConflict(cls);
    if (conflict) {
      setModalType('conflict');
      return;
    }
    setModalType('confirm');
  };

  // API Đăng ký
  const confirmRegister = async () => {
    if (!selectedClass) return;
    const token = localStorage.getItem('access_token');

    try {
        await axios.post(`${BASE_URL}/sessions/me/${selectedClass.id}/register`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        setModalType('success');
        fetchData(); // Tải lại dữ liệu để cập nhật danh sách
    } catch (error: any) {
        toast.error(error.response?.data?.error || "Đăng ký thất bại");
        setModalType('none');
    }
  };

  // API Hủy đăng ký
  const confirmCancel = async () => {
    if (!selectedClass) return;
    const token = localStorage.getItem('access_token');

    try {
        await axios.delete(`${BASE_URL}/sessions/me/${selectedClass.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.success("Hủy lớp thành công");
        setModalType('none');
        setSelectedClass(null);
        fetchData(); // Tải lại dữ liệu
    } catch (error: any) {
        // Hiển thị lỗi nghiệp vụ từ BE (VD: Quá hạn 24h)
        const msg = error.response?.data?.error || "Không thể hủy lớp";
        toast.error(msg, { duration: 4000 });
        setModalType('detail'); // Quay lại modal chi tiết
    }
  };


  // --- RENDER ---
  return (
    <div className="flex h-full gap-6 relative">
      <Toaster position="top-right" />
      
      {/* === CỘT TRÁI (DANH SÁCH & TÌM KIẾM) === */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        
        {/* 1. LỚP ĐÃ ĐĂNG KÝ */}
        <div className="bg-[#EBF4FF] p-4 rounded-3xl shadow-sm border border-blue-100 flex-shrink-0">
          <div className="flex justify-between items-center mb-3 px-2">
             <div className="flex items-center gap-2">
                <HiCalendar className="text-blue-600"/>
                <h2 className="font-bold text-gray-700 text-sm uppercase">Lớp đã đăng ký ({mySessions.length})</h2>
             </div>
          </div>
          
          <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {loading ? <p className="text-center text-xs text-gray-500">Đang tải...</p> : (
                mySessions.map(cls => (
                <div key={cls.id} className="bg-white p-3 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 px-3 py-2 rounded-xl font-bold text-blue-800 text-xs min-w-[100px] text-center truncate max-w-[120px]">
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
                    className="bg-black text-white text-xs px-4 py-2 rounded-full font-bold hover:bg-gray-800 transition whitespace-nowrap"
                    >
                    Chi tiết
                    </button>
                </div>
                ))
            )}
            {!loading && mySessions.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">Bạn chưa đăng ký lớp nào.</p>}
          </div>
        </div>

        {/* 2. TÌM KIẾM & ĐĂNG KÝ (AVAILABLE) */}
        <div className="bg-[#475569] p-6 rounded-[32px] flex-1 shadow-lg flex flex-col min-h-0">
           {/* Search Bar */}
           <div className="relative mb-6 flex-shrink-0">
              <HiOutlineSearch className="absolute left-5 top-4 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Tìm kiếm môn học hoặc giảng viên..." 
                className="w-full pl-12 pr-4 py-3.5 rounded-full outline-none text-gray-700 font-medium shadow-md bg-white/95 focus:bg-white transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>

           {/* Grid List */}
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {loading ? (
                  <div className="col-span-full text-center text-white pt-10">Đang tải danh sách lớp...</div>
              ) : (
                  filteredAvailable.map(cls => (
                    <div key={cls.id} className="bg-[#D1D5DB] p-5 rounded-3xl relative group hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between h-full min-h-[220px]">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-gray-900 leading-tight">{cls.subject}</h3>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${cls.type === 'online' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {cls.type}
                            </span>
                        </div>
                        
                        <div className="space-y-2 text-gray-700 text-sm font-medium">
                            <div className="flex items-center"><HiUser className="w-4 h-4 mr-2 text-gray-500 shrink-0"/> <span className="text-gray-900 truncate">{cls.tutorName}</span></div>
                            <div className="flex items-center"><HiCalendar className="w-4 h-4 mr-2 text-gray-500 shrink-0"/> {cls.date}</div>
                            <div className="flex items-center"><HiClock className="w-4 h-4 mr-2 text-gray-500 shrink-0"/> {cls.startTime} - {cls.endTime}</div>
                            <div className="flex items-center"><HiLocationMarker className="w-4 h-4 mr-2 text-gray-500 shrink-0"/> <span className="truncate">{cls.location} {cls.base && `(${cls.base})`}</span></div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex-1 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                                <div 
                                className={`h-full rounded-full ${cls.currentStudents >= cls.maxStudents ? 'bg-red-500' : 'bg-green-500'}`} 
                                style={{ width: `${Math.min((cls.currentStudents/cls.maxStudents)*100, 100)}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-600 font-bold">{cls.currentStudents}/{cls.maxStudents}</span>
                        </div>
                        
                        <button 
                            onClick={() => onRegisterClick(cls)}
                            className="w-full bg-black text-white py-2.5 rounded-full font-bold hover:bg-gray-800 shadow-lg transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={cls.currentStudents >= cls.maxStudents}
                        >
                            {cls.currentStudents >= cls.maxStudents ? 'Hết chỗ' : 'Đăng ký'}
                        </button>
                    </div>
                    </div>
                ))
              )}
              
              {!loading && filteredAvailable.length === 0 && (
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
         <MiniCalendar selectedDate={filterDate} onDateSelect={handleDateSelect} />

         <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex-1 h-fit">
            <h3 className="font-bold text-gray-400 text-xs uppercase mb-3 tracking-wider">Trạng thái lọc</h3>
            {filterDate ? (
               <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-800">
                  <p className="font-bold text-lg">{format(filterDate, 'dd/MM')}</p>
                  <p className="text-sm">Có <span className="font-bold">{filteredAvailable.length}</span> lớp để đăng ký.</p>
                  <button onClick={() => setFilterDate(null)} className="text-xs underline mt-2 text-blue-600 hover:text-blue-800">Xóa lọc</button>
               </div>
            ) : (
               <div className="text-gray-500 text-sm">
                  Hiển thị tất cả các lớp đang mở. <br/>Chọn ngày trên lịch để lọc.
               </div>
            )}
         </div>
      </div>


      {/* ================= MODALS ================= */}
      
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
                 <button onClick={confirmRegister} className="bg-blue-800 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-900 shadow-lg transition">Xác nhận</button>
                 <button onClick={() => setModalType('none')} className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition">Hủy</button>
              </div>
           </div>
        </PopupWrapper>
      )}

      {/* 2. SUCCESS */}
      {modalType === 'success' && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
           <div className="bg-[#DCFCE7] border border-green-400 text-green-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 pr-10 relative">
              <div className="bg-green-500 rounded-full p-1"><HiCheckCircle className="w-6 h-6 text-white"/></div>
              <div><h4 className="font-bold text-lg">Thành công</h4><p className="text-sm font-medium opacity-90">Đăng ký thành công!</p></div>
              <button onClick={() => setModalType('none')} className="absolute top-2 right-2 p-1 hover:bg-green-200 rounded-full"><HiX className="w-4 h-4"/></button>
           </div>
        </div>
      )}

      {/* 3. CONFLICT */}
      {modalType === 'conflict' && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
           <div className="bg-[#FEF9C3] border border-yellow-400 text-yellow-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 pr-10 relative w-[400px]">
              <div className="bg-yellow-500 rounded-full p-1 flex-shrink-0"><HiExclamation className="w-6 h-6 text-white"/></div>
              <div><h4 className="font-bold text-lg">Trùng lịch</h4><p className="text-sm font-medium opacity-90">Bạn đã có lịch học khác vào khung giờ này.</p></div>
              <button onClick={() => setModalType('none')} className="absolute top-2 right-2 p-1 hover:bg-yellow-200 rounded-full"><HiX className="w-4 h-4"/></button>
           </div>
        </div>
      )}

      {/* 4. FULL */}
      {modalType === 'full' && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
           <div className="bg-red-100 border border-red-400 text-red-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 pr-10 relative">
              <div className="bg-red-500 rounded-full p-1"><HiExclamation className="w-6 h-6 text-white"/></div>
              <div><h4 className="font-bold text-lg">Lớp đã đầy</h4><p className="text-sm font-medium opacity-90">Vui lòng chọn lớp khác.</p></div>
              <button onClick={() => setModalType('none')} className="absolute top-2 right-2 p-1 hover:bg-red-200 rounded-full"><HiX className="w-4 h-4"/></button>
           </div>
        </div>
      )}

      {/* 5. DETAIL MODAL (Hủy) */}
      {modalType === 'detail' && selectedClass && (
        <PopupWrapper onClose={() => setModalType('none')} title="Chi tiết buổi học">
           <div className="space-y-4 text-gray-700 px-4">
              <InfoRow label="Chủ đề" value={selectedClass.subject} />
              <InfoRow label="Giảng viên" value={selectedClass.tutorName} highlight />
              <div className="flex gap-4">
                 <InfoRow label="Ngày" value={selectedClass.date} isDate />
                 <InfoRow label="Giờ" value={`${selectedClass.startTime}`} isBox />
              </div>
              <InfoRow label="Hình thức" value={selectedClass.type === 'online' ? 'Trực tuyến' : 'Trực tiếp'} />
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                 <InfoRow label="Địa điểm" value={selectedClass.location} />
                 {selectedClass.base && <InfoRow label="Cơ sở" value={selectedClass.base} />}
              </div>
           </div>
           
           <div className="mt-8 flex justify-center">
              <button 
                onClick={() => setModalType('confirm-cancel')} 
                className="bg-red-50 text-red-600 font-bold py-3 px-10 rounded-full hover:bg-red-100 transition border border-red-200 shadow-sm"
              >
                Hủy đăng ký
              </button>
           </div>
        </PopupWrapper>
      )}

      {/* 6. CONFIRM CANCEL */}
      {modalType === 'confirm-cancel' && (
         <PopupWrapper onClose={() => setModalType('detail')}>
            <div className="text-center pt-2">
               <h3 className="text-blue-900 font-bold text-2xl mb-2 font-serif">Xác nhận hủy?</h3>
               <p className="text-gray-600 mb-8 px-6">
                  Bạn có chắc chắn muốn hủy đăng ký? <br/>
                  <span className="text-xs text-red-500 italic">(Lưu ý: Chỉ được hủy trước 24h khi lớp bắt đầu)</span>
               </p>
               <div className="flex justify-center gap-4">
                  <button onClick={confirmCancel} className="bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 shadow-lg">Hủy ngay</button>
                  <button onClick={() => setModalType('detail')} className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-300">Quay lại</button>
               </div>
            </div>
         </PopupWrapper>
      )}

    </div>
  );
}

// --- SUB COMPONENTS (Giữ nguyên) ---

const MiniCalendar = ({ selectedDate, onDateSelect }: { selectedDate: Date | null, onDateSelect: (d: Date) => void }) => {
   const [viewDate, setViewDate] = useState(new Date());
   const nextMonth = () => setViewDate(addMonths(viewDate, 1));
   const prevMonth = () => setViewDate(subMonths(viewDate, 1));
   const days = eachDayOfInterval({ start: startOfWeek(startOfMonth(viewDate)), end: endOfWeek(endOfMonth(viewDate)) });

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
                  <div key={i} onClick={() => onDateSelect(day)}
                     className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium mx-auto cursor-pointer transition-all duration-200 ${!isCurrentMonth ? 'text-gray-400 opacity-50' : 'text-gray-700'} ${isSelected ? 'bg-black text-white shadow-lg scale-110' : 'hover:bg-white'} ${!isSelected && isTodayDate ? 'border-2 border-red-600 font-bold text-red-600' : ''}`}
                  >{format(day, 'd')}</div>
               );
            })}
         </div>
      </div>
   );
};

const PopupWrapper = ({ children, onClose, title }: any) => (
   <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-[32px] p-8 w-[500px] shadow-2xl relative transform transition-all scale-100 border-4 border-white/20">
         <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full p-2 transition"><HiX className="w-6 h-6"/></button>
         {title && <h2 className="text-center text-3xl font-bold text-blue-900 mb-8 font-serif">{title}</h2>}
         {children}
      </div>
   </div>
);

const InfoRow = ({ label, value, isBox, isDate, highlight }: any) => (
   <div className="flex items-center mb-3">
     <span className="font-bold text-blue-900 w-28 flex-shrink-0 text-sm uppercase tracking-wide opacity-80">{label}</span>
     {isBox ? ( <span className="border-2 border-blue-900 text-blue-900 px-3 py-0.5 rounded-lg font-bold tracking-widest bg-blue-50">{value}</span> ) 
     : isDate ? ( <span className="font-bold text-blue-900 tracking-widest border-2 border-blue-200 bg-blue-50 px-2 rounded-lg">{value}</span> ) 
     : ( <span className={`font-medium text-lg ${highlight ? 'text-black font-bold' : 'text-gray-700'}`}>{value}</span> )}
   </div>
);
"use client";

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight, HiPlus, HiX } from 'react-icons/hi';
import { MOCK_SCHEDULE, Session } from '@/app/data/mockData';
import toast from 'react-hot-toast';

// --- 1. IMPORT CÁC HÀM XỬ LÝ NGÀY THÁNG ---
import { 
  format, 
  addWeeks, 
  subWeeks, 
  startOfWeek, 
  addDays, 
  getWeek 
} from 'date-fns';
// Import locale tiếng Việt nếu muốn (ở đây mình dùng tiếng Anh cho giống design)

// Các hằng số giữ nguyên
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PERIODS = [
  { id: 'morning', label: 'Sáng', icon: '🌅' },
  { id: 'afternoon', label: 'Chiều', icon: '☀️' },
  { id: 'evening', label: 'Tối', icon: '🌙' },
];

export default function TutorSchedulePage() {
  // --- STATE NGÀY THÁNG ---
  // Mặc định lấy ngày hôm nay
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- STATE DATA & MODAL (Giữ nguyên) ---
  const [schedule, setSchedule] = useState<Session[]>(MOCK_SCHEDULE);
  const [viewMode, setViewMode] = useState<'none' | 'create' | 'detail' | 'edit' | 'cancel'>('none');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState<Partial<Session>>({});

  // --- CÁC HÀM ĐIỀU HƯỚNG LỊCH ---
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  
  // Tính toán ngày bắt đầu của tuần hiện tại (Thứ 2 là ngày bắt đầu: weekStartsOn: 1)
  const startDateOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });


  // --- ACTIONS (LOGIC POPUP - Giữ nguyên logic cũ) ---
  const openCreateModal = (day: string, period: string, dateStr: string) => {
    setFormData({ 
      day, 
      period: period as any, 
      date: dateStr, // Tự động điền ngày chính xác vào Form
      type: 'online', 
      duration: 120, 
      maxStudents: 10 
    });
    setViewMode('create');
  };
  const openDetailModal = (session: Session) => {
    setSelectedSession(session);
    setViewMode('detail');
  };
  const handleSave = () => {
    if (viewMode === 'create') {
      const newSession = { ...formData, id: Date.now(), status: 'open' } as Session;
      setSchedule([...schedule, newSession]);
      toast.success('Tạo buổi hỗ trợ thành công!');
    } else if (viewMode === 'edit') {
      setSchedule(schedule.map(s => s.id === selectedSession?.id ? { ...s, ...formData } as Session : s));
      toast.success('Cập nhật thành công!');
    }
    closeModal();
  };
  const handleCancel = () => {
    if (selectedSession) {
      setSchedule(schedule.filter(s => s.id !== selectedSession.id));
      toast.success('Đã hủy buổi học!');
      closeModal();
    }
  };
  const closeModal = () => {
    setViewMode('none');
    setSelectedSession(null);
    setFormData({});
  };

  // --- RENDER GIAO DIỆN ---
  return (
    <div className="h-full flex flex-col space-y-4">
      
      {/* === 2. HEADER LỊCH ĐỘNG === */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        {/* Hiển thị Tháng và Năm hiện tại (VD: November 2025) */}
        <h1 className="text-3xl font-bold text-blue-900 font-serif">
          {format(currentDate, 'MMMM yyyy')}
        </h1>
        
        <div className="flex items-center space-x-4 bg-gray-100 p-1 rounded-full">
          {/* Nút lùi 1 tuần */}
          <button onClick={prevWeek} className="p-2 hover:bg-white rounded-full shadow-sm transition">
            <HiChevronLeft className="w-5 h-5 text-blue-800"/>
          </button>
          
          {/* Hiển thị số tuần (VD: Week 48) */}
          <span className="text-lg font-bold text-blue-900 px-2 min-w-[80px] text-center">
            Week {getWeek(currentDate, { weekStartsOn: 1 })}
          </span>
          
          {/* Nút tiến 1 tuần */}
          <button onClick={nextWeek} className="p-2 hover:bg-white rounded-full shadow-sm transition">
            <HiChevronRight className="w-5 h-5 text-blue-800"/>
          </button>
        </div>
      </div>

      {/* === GRID LỊCH CHÍNH === */}
      <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border">
        
        {/* 3. HEADER CÁC NGÀY (HIỂN THỊ NGÀY THẬT) */}
        <div className="grid grid-cols-8 border-b text-center bg-blue-50">
           <div className="border-r border-blue-100 p-3 font-bold text-blue-900">Buổi</div>
           
           {/* Vòng lặp tạo ra header cột */}
           {DAYS.map((dayLabel, index) => {
             // Tính ngày cụ thể cho cột này (VD: Mon + 0 ngày, Tue + 1 ngày...)
             const dateOfColumn = addDays(startDateOfWeek, index);
             // Kiểm tra xem có phải là "hôm nay" không để highlight
             const isToday = format(new Date(), 'dd/MM/yyyy') === format(dateOfColumn, 'dd/MM/yyyy');
             
             return (
              <div key={dayLabel} className={`border-r border-blue-100 p-2 last:border-0 ${isToday ? 'bg-blue-100' : ''}`}>
                <div className="font-bold text-blue-900">{dayLabel}</div>
                {/* Hiển thị ngày/tháng (VD: 25/11) */}
                <div className={`text-sm ${isToday ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                  {format(dateOfColumn, 'dd/MM')}
                </div>
              </div>
             );
           })}
        </div>

        {/* Nội dung Grid */}
<div className="flex-1 grid grid-rows-3 divide-y divide-blue-100">
  {PERIODS.map((p) => (
    <div key={p.id} className="grid grid-cols-8 divide-x divide-blue-100">
      
      {/* Cột tên buổi */}
      <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-900 p-2 font-medium">
          <span className="text-2xl mb-1">{p.icon}</span>
          <span className="text-sm">{p.label}</span>
      </div>

      {/* Các ô lịch */}
      {DAYS.map((dayLabel, index) => {
        // 1. TÍNH NGÀY CỤ THỂ CỦA CỘT NÀY
        const dateOfColumn = addDays(startDateOfWeek, index);
        const dateStr = format(dateOfColumn, 'dd/MM/yyyy'); // VD: "25/11/2025"

        // 2. LỌC CHÍNH XÁC THEO NGÀY (Sửa lỗi hiển thị lặp lại)
        const sessionsInSlot = schedule.filter(s => 
            s.period === p.id && 
            s.date === dateStr // <--- QUAN TRỌNG: Phải trùng ngày mới hiện
        );

        return (
          <div 
            key={dayLabel} 
            className="relative p-2 hover:bg-blue-50/50 transition min-h-[120px] group flex flex-col gap-2"
            // 3. SỬA LỖI KHÔNG THỂ THÊM LỊCH: Luôn cho phép bấm để tạo mới
            onClick={() => openCreateModal(dayLabel, p.id, dateStr)} 
          >
            {/* Render các buổi học đã có */}
            {sessionsInSlot.map(s => (
              <div 
                key={s.id}
                // StopPropagation để khi bấm vào thẻ thì xem chi tiết, không kích hoạt tạo mới
                onClick={(e) => { e.stopPropagation(); openDetailModal(s); }}
                className={`
                  p-2 rounded-lg cursor-pointer shadow-sm text-sm font-bold border-l-4 hover:shadow-md transition z-10
                  ${s.status === 'open' ? 'bg-green-50 text-green-800 border-green-500' : 'bg-indigo-50 text-indigo-800 border-indigo-500'}
                  ${s.status === 'cancelled' ? 'bg-red-50 text-red-800 border-red-500 opacity-70' : ''}
                `}
              >
                <div className="truncate">{s.subject}</div>
                <div className="text-xs font-normal mt-1 opacity-80">{s.startTime} - {s.duration}'</div>
              </div>
            ))}

            {/* Nút dấu cộng ẩn (Hiện khi hover) để báo hiệu có thể thêm tiếp */}
            <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <div className="p-1 rounded-full bg-blue-100 text-blue-600">
                    <HiPlus className="w-4 h-4" />
                </div>
            </div>
          </div>
        );
      })}
    </div>
  ))}
</div>
      </div>

      {/* Footer chú thích (Giữ nguyên) */}
      <div className="p-3 bg-white rounded-xl flex justify-center space-x-6 text-sm border shadow-sm">
          <div className="flex items-center"><div className="w-3 h-3 bg-green-500 mr-2 rounded-sm"></div> Đang mở (Sắp diễn ra)</div>
          <div className="flex items-center"><div className="w-3 h-3 bg-indigo-500 mr-2 rounded-sm"></div> Đã hoàn thành</div>
          <div className="flex items-center"><div className="w-3 h-3 bg-red-500 mr-2 rounded-sm opacity-70"></div> Đã hủy</div>
      </div>


      {/* ======================= KHU VỰC MODAL (Giữ nguyên code Popup cũ của bạn ở đây) ======================= */}
      {/* (Mình đã rút gọn phần này để đỡ dài dòng, bạn hãy giữ lại code Modal cũ của mình ở các bước trước nhé, nó vẫn hoạt động tốt với code mới này) */}
       {/* ... Code Modal Chi tiết, Tạo mới, Hủy ... */}
      {/* Nếu bạn lỡ xóa, bảo mình để mình gửi lại full code */}
      
      <MyModals 
        viewMode={viewMode}
        selectedSession={selectedSession}
        formData={formData}
        setFormData={setFormData}
        setViewMode={setViewMode}
        handleSave={handleSave}
        handleCancel={handleCancel}
        closeModal={closeModal}
      />

    </div>
  );
}

// --- Component chứa các Modal (Tách ra cho gọn file chính) ---
// Bạn có thể để nguyên đống modal cũ vào đây thay vì tách component
const MyModals = ({ viewMode, selectedSession, formData, setFormData, setViewMode, handleSave, handleCancel, closeModal }: any) => {
    // --- SUB-COMPONENTS CHO MODAL ---
    const InfoRow = ({ label, value, isBox }: any) => (
      <div className="flex items-start">
        <span className="font-bold text-blue-800 w-32 flex-shrink-0">{label}:</span>
        {isBox ? <span className="border border-blue-800 text-blue-800 px-2 rounded font-bold">{value}</span> : <span className="font-medium text-gray-800">{value}</span>}
      </div>
    );
    const InputGroup = ({ label, value, onChange, type = 'text', placeholder }: any) => (
      <div className="flex items-center space-x-4">
        <label className="font-bold text-blue-800 w-32 flex-shrink-0">{label}:</label>
        <input type={type} className="flex-1 border border-gray-300 rounded-full px-4 py-2 bg-gray-100 focus:bg-white focus:outline-blue-500 transition" value={value || ''} onChange={e => onChange && onChange(e.target.value)} placeholder={placeholder}/>
      </div>
    );

  return (
    <>
    {/* 1. MODAL CHI TIẾT */}
    {viewMode === 'detail' && selectedSession && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-2xl w-[600px] p-8 shadow-2xl relative">
             <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><HiX className="w-6 h-6"/></button>
             <h2 className="text-center text-3xl font-bold text-blue-800 mb-6 font-serif">Chi tiết buổi hỗ trợ</h2>
             <div className="space-y-4 text-gray-700">
               <InfoRow label="Chủ đề" value={selectedSession.subject} />
               {/* Hiển thị ngày tháng đẹp hơn */}
               <InfoRow label="Thời gian" value={`${selectedSession.day}, ${selectedSession.date} | ${selectedSession.startTime} (${selectedSession.duration} phút)`} />
               <InfoRow label="Hình thức" value={selectedSession.type === 'online' ? 'Trực tuyến (Online)' : 'Trực tiếp (Offline)'} />
               <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <InfoRow label={selectedSession.type === 'online' ? 'Nền tảng' : 'Phòng học'} value={selectedSession.location} />
                  {selectedSession.type === 'offline' && <InfoRow label="Cơ sở" value={selectedSession.base || ''} />}
               </div>
               <InfoRow label="Trạng thái" value={selectedSession.status === 'open' ? <span className="text-green-600 font-bold">Đang mở</span> : selectedSession.status === 'finished' ? <span className="text-indigo-600 font-bold">Đã hoàn thành</span> : <span className="text-red-600 font-bold">Đã hủy</span>} />
             </div>
             {selectedSession.status === 'open' && (
                <div className="flex justify-center space-x-4 mt-8">
                    <button onClick={() => { setFormData(selectedSession); setViewMode('edit'); }} className="bg-blue-800 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-900">Đổi lịch</button>
                    <button onClick={() => setViewMode('cancel')} className="bg-red-100 text-red-700 font-bold py-2 px-6 rounded-full hover:bg-red-200">Hủy buổi</button>
                </div>
             )}
          </div>
        </div>
      )}

      {/* 2. MODAL TẠO MỚI / CHỈNH SỬA */}
      {(viewMode === 'create' || viewMode === 'edit') && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-2xl w-[600px] p-8 shadow-2xl relative">
             <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><HiX className="w-6 h-6"/></button>
             <h2 className="text-center text-3xl font-bold text-blue-800 mb-6 font-serif">{viewMode === 'create' ? 'Tạo buổi hỗ trợ mới' : 'Thay đổi buổi hỗ trợ'}</h2>
             <div className="space-y-4">
                <InputGroup label="Chủ đề" value={formData.subject} onChange={(v:string) => setFormData({...formData, subject: v})} placeholder="Nhập tên môn học..." />
                <div className="flex space-x-4">
                   <div className="flex-1"><label className="block text-blue-800 font-bold mb-1 text-sm ml-4">Ngày</label><input type="date" className="w-full border p-2 rounded-full px-4 bg-gray-100" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})}/></div>
                   <div className="flex-1"><label className="block text-blue-800 font-bold mb-1 text-sm ml-4">Giờ bắt đầu</label><input type="time" className="w-full border p-2 rounded-full px-4 bg-gray-100" value={formData.startTime || ''} onChange={e => setFormData({...formData, startTime: e.target.value})}/></div>
                </div>
                <InputGroup label="Thời lượng (phút)" type="number" value={formData.duration} onChange={(v:string) => setFormData({...formData, duration: Number(v)})} />
                <div className="flex items-center space-x-4"><label className="font-bold text-blue-800 w-32 flex-shrink-0">Hình thức:</label><select className="flex-1 border border-gray-300 rounded-full px-4 py-2 bg-gray-100 focus:outline-blue-500" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as any})}><option value="online">Trực tuyến (Online)</option><option value="offline">Trực tiếp (Offline)</option></select></div>
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
                   {formData.type === 'online' ? <InputGroup label="Link Meet" placeholder="https://..." value={formData.location} onChange={(v:string) => setFormData({...formData, location: v})}/> : <><InputGroup label="Phòng học" value={formData.location} onChange={(v:string) => setFormData({...formData, location: v})}/><InputGroup label="Cơ sở" value={formData.base} onChange={(v:string) => setFormData({...formData, base: v})}/></>}
                </div>
                <InputGroup label="Số ĐK tối đa" type="number" value={formData.maxStudents} onChange={(v:string) => setFormData({...formData, maxStudents: Number(v)})} />
             </div>
             <div className="flex justify-center space-x-4 mt-8">
               <button onClick={handleSave} className="bg-blue-800 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-900 shadow-lg shadow-blue-200">{viewMode === 'create' ? 'Tạo buổi hỗ trợ' : 'Xác nhận đổi'}</button>
             </div>
          </div>
        </div>
      )}

      {/* 3. MODAL HỦY BUỔI */}
      {viewMode === 'cancel' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
           <div className="bg-white rounded-2xl w-96 p-6 relative shadow-2xl text-center">
              <h3 className="text-red-600 font-bold text-xl mb-2">Xác nhận hủy buổi học?</h3>
              <p className="text-gray-600 text-sm mb-4">Hành động này không thể hoàn tác.</p>
              <div className="flex justify-center space-x-4 mt-6">
                 <button onClick={() => setViewMode('detail')} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-full hover:bg-gray-300">Quay lại</button>
                 <button onClick={handleCancel} className="bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 shadow-lg shadow-red-200">Hủy ngay</button>
              </div>
           </div>
        </div>
      )}
    </>
  )
}
"use client";

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight, HiPlus, HiX } from 'react-icons/hi';
import { MOCK_SCHEDULE, Session } from '@/app/data/mockData';
import toast from 'react-hot-toast';
import { 
  format, addWeeks, subWeeks, startOfWeek, addDays, getWeek, parse, isValid 
} from 'date-fns';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PERIODS = [
  { id: 'morning', label: 'Sáng', icon: '🌅' },
  { id: 'afternoon', label: 'Chiều', icon: '☀️' },
  { id: 'evening', label: 'Tối', icon: '🌙' },
];

// --- HÀM TIỆN ÍCH CHUYỂN ĐỔI NGÀY ---
// 1. Chuyển từ dd/MM/yyyy (Display) -> YYYY-MM-DD (Input)
const toInputDate = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    // Parse ngày từ chuỗi dd/MM/yyyy
    const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
    if (!isValid(parsed)) return '';
    return format(parsed, 'yyyy-MM-dd');
  } catch (e) {
    return '';
  }
};

// 2. Chuyển từ YYYY-MM-DD (Input) -> dd/MM/yyyy (Database)
const fromInputDate = (dateValue: string) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  return format(date, 'dd/MM/yyyy');
};


export default function TutorSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // State Data
  const [schedule, setSchedule] = useState<Session[]>(MOCK_SCHEDULE);
  const [viewMode, setViewMode] = useState<'none' | 'create' | 'detail' | 'edit' | 'cancel'>('none');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  
  // Form Data
  const [formData, setFormData] = useState<Partial<Session>>({});

  // Navigation Logic
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const startDateOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

  // --- ACTIONS ---
  const openCreateModal = (day: string, period: string, dateStr: string) => {
    setFormData({ 
      day, 
      period: period as any, 
      date: dateStr, // Đang là format dd/MM/yyyy
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
      // Logic hủy: Chuyển status thành cancelled
      setSchedule(schedule.map(s => s.id === selectedSession.id ? { ...s, status: 'cancelled' } as Session : s));
      toast.success('Đã hủy buổi học!');
      closeModal();
    }
  };

  const closeModal = () => {
    setViewMode('none');
    setSelectedSession(null);
    setFormData({});
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header Lịch */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <h1 className="text-3xl font-bold text-blue-900 font-serif">
          {format(currentDate, 'MMMM yyyy')}
        </h1>
        <div className="flex items-center space-x-4 bg-gray-100 p-1 rounded-full">
          <button onClick={prevWeek} className="p-2 hover:bg-white rounded-full shadow-sm transition"><HiChevronLeft className="w-5 h-5 text-blue-800"/></button>
          <span className="text-lg font-bold text-blue-900 px-2 min-w-[80px] text-center">Week {getWeek(currentDate, { weekStartsOn: 1 })}</span>
          <button onClick={nextWeek} className="p-2 hover:bg-white rounded-full shadow-sm transition"><HiChevronRight className="w-5 h-5 text-blue-800"/></button>
        </div>
      </div>

      {/* Grid Lịch */}
      <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border">
        {/* Header Ngày */}
        <div className="grid grid-cols-8 border-b text-center bg-blue-50">
           <div className="border-r border-blue-100 p-3 font-bold text-blue-900">Buổi</div>
           {DAYS.map((dayLabel, index) => {
             const dateOfColumn = addDays(startDateOfWeek, index);
             const dateStr = format(dateOfColumn, 'dd/MM/yyyy');
             const isToday = format(new Date(), 'dd/MM/yyyy') === dateStr;
             return (
              <div key={dayLabel} className={`border-r border-blue-100 p-2 last:border-0 ${isToday ? 'bg-blue-100' : ''}`}>
                <div className="font-bold text-blue-900">{dayLabel}</div>
                <div className={`text-sm ${isToday ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>{format(dateOfColumn, 'dd/MM')}</div>
              </div>
             );
           })}
        </div>

        {/* Body Lịch */}
        <div className="flex-1 grid grid-rows-3 divide-y divide-blue-100">
          {PERIODS.map((p) => (
            <div key={p.id} className="grid grid-cols-8 divide-x divide-blue-100">
              <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-900 p-2 font-medium">
                 <span className="text-2xl mb-1">{p.icon}</span>
                 <span className="text-sm">{p.label}</span>
              </div>
              {DAYS.map((dayLabel, index) => {
                const dateOfColumn = addDays(startDateOfWeek, index);
                const dateStr = format(dateOfColumn, 'dd/MM/yyyy');
                const sessionsInSlot = schedule.filter(s => s.period === p.id && s.date === dateStr);

                return (
                  <div 
                    key={dayLabel} 
                    className="relative p-2 hover:bg-blue-50/50 transition min-h-[120px] group flex flex-col gap-2 cursor-pointer"
                    onClick={() => openCreateModal(dayLabel, p.id, dateStr)}
                  >
                    {sessionsInSlot.map(s => (
                      <div 
                        key={s.id}
                        onClick={(e) => { e.stopPropagation(); openDetailModal(s); }}
                        className={`
                          p-2 rounded-lg shadow-sm text-sm font-bold border-l-4 hover:shadow-md transition z-10
                          ${s.status === 'open' ? 'bg-green-50 text-green-800 border-green-500' : s.status === 'finished' ? 'bg-indigo-50 text-indigo-800 border-indigo-500' : 'bg-red-50 text-red-800 border-red-500 opacity-70'}
                        `}
                      >
                        <div className="truncate">{s.subject}</div>
                        <div className="text-xs font-normal mt-1 opacity-80">{s.startTime} - {s.duration}'</div>
                      </div>
                    ))}
                    {sessionsInSlot.length === 0 && (
                        <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <div className="p-1 rounded-full bg-blue-100 text-blue-600"><HiPlus className="w-4 h-4" /></div>
                        </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* --- SỬ DỤNG COMPONENT MODAL TÁCH RIÊNG (ĐÃ FIX LỖI FOCUS) --- */}
      <ScheduleModals 
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

// =========================================================================
// QUAN TRỌNG: CÁC COMPONENT CON ĐƯỢC ĐƯA RA NGOÀI (FIX LỖI MẤT FOCUS)
// =========================================================================

// 1. Component InputGroup
type InputGroupProps = {
  label: string;
  value?: string | number;
  onChange?: (val: string) => void;
  type?: string;
  placeholder?: string;
};

const InputGroup = ({ label, value, onChange, type = 'text', placeholder }: InputGroupProps) => (
  <div className="flex items-center space-x-4">
    <label className="font-bold text-blue-800 w-32 flex-shrink-0 text-sm">{label}:</label>
    <input 
      type={type} 
      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:bg-white focus:outline-blue-500 transition text-sm"
      value={value || ''}
      onChange={e => onChange && onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

// 2. Component InfoRow
const InfoRow = ({ label, value, isBox }: any) => (
  <div className="flex items-start">
    <span className="font-bold text-blue-800 w-32 flex-shrink-0 text-sm">{label}:</span>
    {isBox ? <span className="border border-blue-800 text-blue-800 px-2 rounded font-bold text-sm">{value}</span> : <span className="font-medium text-gray-800 text-sm">{value}</span>}
  </div>
);

// 3. Component chứa toàn bộ Modal
const ScheduleModals = ({ viewMode, selectedSession, formData, setFormData, setViewMode, handleSave, handleCancel, closeModal }: any) => {
  return (
    <>
      {/* MODAL CHI TIẾT */}
      {viewMode === 'detail' && selectedSession && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-2xl w-[500px] p-6 shadow-2xl relative">
             <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><HiX className="w-6 h-6"/></button>
             <h2 className="text-center text-2xl font-bold text-blue-800 mb-6 font-serif">Chi tiết buổi hỗ trợ</h2>
             <div className="space-y-3 text-gray-700">
               <InfoRow label="Chủ đề" value={selectedSession.subject} />
               <InfoRow label="Thời gian" value={`${selectedSession.day}, ${selectedSession.date} | ${selectedSession.startTime}`} />
               <InfoRow label="Hình thức" value={selectedSession.type === 'online' ? 'Trực tuyến' : 'Trực tiếp'} />
               <div className="bg-gray-50 p-3 rounded-lg border">
                  <InfoRow label={selectedSession.type === 'online' ? 'Link' : 'Phòng'} value={selectedSession.location} />
                  {selectedSession.base && <InfoRow label="Cơ sở" value={selectedSession.base} />}
               </div>
               <InfoRow label="Trạng thái" value={selectedSession.status === 'open' ? 'Đang mở' : selectedSession.status === 'cancelled' ? 'Đã hủy' : 'Hoàn thành'} />
             </div>
             {selectedSession.status === 'open' && (
                <div className="flex justify-center space-x-3 mt-6">
                    <button onClick={() => { setFormData(selectedSession); setViewMode('edit'); }} className="bg-blue-800 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-900 text-sm">Đổi lịch</button>
                    <button onClick={() => setViewMode('cancel')} className="bg-red-100 text-red-700 font-bold py-2 px-6 rounded-full hover:bg-red-200 text-sm">Hủy buổi</button>
                </div>
             )}
          </div>
        </div>
      )}

      {/* MODAL TẠO MỚI / CHỈNH SỬA */}
      {(viewMode === 'create' || viewMode === 'edit') && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-2xl w-[600px] p-8 shadow-2xl relative">
             <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><HiX className="w-6 h-6"/></button>
             <h2 className="text-center text-2xl font-bold text-blue-800 mb-6 font-serif">{viewMode === 'create' ? 'Tạo buổi mới' : 'Sửa buổi học'}</h2>
             
             <div className="space-y-4">
                <InputGroup label="Chủ đề" value={formData.subject} onChange={(v: string) => setFormData({...formData, subject: v})} placeholder="Nhập tên môn..." />
                
                <div className="flex space-x-4">
                   <div className="flex-1">
                      {/* FIX LỖI DATE: Dùng type="date" và chuyển đổi format */}
                      <label className="block text-blue-800 font-bold mb-1 text-sm ml-4">Ngày</label>
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                        // Chuyển từ dd/MM/yyyy -> YYYY-MM-DD để hiển thị đúng trong input
                        value={toInputDate(formData.date)} 
                        // Khi chọn xong -> Chuyển lại thành dd/MM/yyyy để lưu vào state
                        onChange={e => setFormData({...formData, date: fromInputDate(e.target.value)})}
                      />
                   </div>
                   <div className="flex-1">
                      <label className="block text-blue-800 font-bold mb-1 text-sm ml-4">Giờ bắt đầu</label>
                      <input type="time" className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" value={formData.startTime || ''} onChange={e => setFormData({...formData, startTime: e.target.value})}/>
                   </div>
                </div>

                <InputGroup label="Thời lượng" type="number" value={formData.duration} onChange={(v: string) => setFormData({...formData, duration: Number(v)})} />
                
                <div className="flex items-center space-x-4">
                    <label className="font-bold text-blue-800 w-32 flex-shrink-0 text-sm">Hình thức:</label>
                    <select className="flex-1 border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as any})}>
                        <option value="online">Trực tuyến (Online)</option>
                        <option value="offline">Trực tiếp (Offline)</option>
                    </select>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
                   {formData.type === 'online' ? (
                      <InputGroup label="Link Meet" placeholder="https://..." value={formData.location} onChange={(v: string) => setFormData({...formData, location: v})}/>
                   ) : (
                      <>
                        <InputGroup label="Phòng học" value={formData.location} onChange={(v: string) => setFormData({...formData, location: v})}/>
                        <InputGroup label="Cơ sở" value={formData.base} onChange={(v: string) => setFormData({...formData, base: v})}/>
                      </>
                   )}
                </div>
                <InputGroup label="Số SV tối đa" type="number" value={formData.maxStudents} onChange={(v: string) => setFormData({...formData, maxStudents: Number(v)})} />
             </div>

             <div className="flex justify-center space-x-4 mt-8">
               <button onClick={handleSave} className="bg-blue-800 text-white font-bold py-2 px-8 rounded-full hover:bg-blue-900 shadow-lg">{viewMode === 'create' ? 'Tạo' : 'Lưu'}</button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL HỦY BUỔI */}
      {viewMode === 'cancel' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
           <div className="bg-white rounded-2xl w-96 p-6 relative shadow-2xl text-center">
              <h3 className="text-red-600 font-bold text-xl mb-2">Xác nhận hủy?</h3>
              <p className="text-gray-600 text-sm mb-6">Hành động này không thể hoàn tác.</p>
              <div className="flex justify-center space-x-4">
                 <button onClick={() => setViewMode('detail')} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-full hover:bg-gray-300 text-sm">Quay lại</button>
                 <button onClick={handleCancel} className="bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 text-sm shadow-lg">Hủy ngay</button>
              </div>
           </div>
        </div>
      )}
    </>
  );
};
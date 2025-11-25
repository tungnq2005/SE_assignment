// --- 1. DỮ LIỆU LỚP HỌC (Dùng cho cả Student và Tutor) ---
export const MOCK_CLASSES = [
  {
    id: 1,
    title: "Công nghệ phần mềm",
    code: "CO3001",
    base: "2",
    room: "H6 - 702",
    time: "15h - 17h",
    tutorName: "Lương Ngọc Trung",
    studentCount: 45,
    status: "ongoing", // đang học
    type: "student" // Lớp này user đang học
  },
  {
    id: 2,
    title: "Cấu trúc rời rạc",
    code: "CO1007",
    base: "2",
    room: "H3 - 201",
    time: "07h - 09h",
    tutorName: "Nguyễn Văn A",
    studentCount: 30,
    status: "ongoing",
    type: "student"
  },
  {
    id: 3,
    title: "Lập trình Web",
    code: "CO3005",
    base: "1",
    room: "B1 - 304",
    time: "13h - 15h",
    tutorName: "Me", // Lớp này user đang DẠY
    studentCount: 20,
    status: "teaching",
    type: "tutor"
  }
];

// --- 2. DỮ LIỆU THỐNG KÊ (Cho Admin) ---
export const MOCK_STATS = {
  students: [6500, 3800, 3800, 3800], // Số liệu biểu đồ cột
  tutors: [4800, 6500, 6500, 6500],
  feedback: {
    good: 75,
    bad: 25
  }
};

// --- 3. DỮ LIỆU USER (Cho Profile) ---
export const MOCK_USER_PROFILE = {
  name: "Lương Ngọc Trung",
  role: "Tutor",
  id: "2110123",
  email: "trung.deptrai@hcmut.edu.vn",
  faculty: "Khoa học & Kỹ thuật Máy tính",
  avatar: "/avatar-placeholder.png"
};

// --- 4. DỮ LIỆU LỊCH DẠY (SCHEDULE) ---
// ... (Các phần trên giữ nguyên)

export type Session = {
  id: number;
  subject: string;
  tutorName: string; // <-- THÊM TRƯỜNG NÀY
  day: string;
  period: 'morning' | 'afternoon' | 'evening';
  date: string;
  startTime: string;
  endTime: string; // <-- THÊM ĐỂ CHECK TRÙNG LỊCH DỄ HƠN
  duration: number;
  type: 'online' | 'offline';
  location: string;
  base?: string;
  maxStudents: number;
  currentStudents: number; // <-- Số lượng đã đăng ký
  status: 'open' | 'finished' | 'cancelled';
};

export const MOCK_SCHEDULE: Session[] = [
  {
    id: 1,
    subject: "Cấu trúc rời rạc",
    tutorName: "Mai Đức Trung",
    day: "Tue",
    period: "afternoon",
    date: "19/08/2025",
    startTime: "15:00",
    endTime: "17:00",
    duration: 120,
    type: "offline",
    location: "H6 - 201",
    base: "2",
    maxStudents: 40,
    currentStudents: 36,
    status: "open"
  },
  {
    id: 2,
    subject: "Giải tích 2",
    tutorName: "Nguyễn Văn A",
    day: "Tue",
    period: "afternoon",
    date: "19/08/2025", // TRÙNG GIỜ VỚI ID 1 (Để test trùng lịch)
    startTime: "15:00",
    endTime: "17:00",
    duration: 120,
    type: "offline",
    location: "H1 - 304",
    base: "1",
    maxStudents: 40,
    currentStudents: 10,
    status: "open"
  },
  {
    id: 3,
    subject: "PPL",
    tutorName: "Trần Thị B",
    day: "Wed",
    period: "morning",
    date: "20/08/2025",
    startTime: "09:00",
    endTime: "11:00",
    duration: 120,
    type: "offline",
    location: "A2 - 203",
    base: "1",
    maxStudents: 40,
    currentStudents: 2,
    status: "open"
  },
  {
    id: 4,
    subject: "Hệ thống số",
    tutorName: "Mai Đức Trung",
    day: "Thu",
    period: "morning",
    date: "21/08/2025",
    startTime: "08:00",
    endTime: "10:00",
    duration: 120,
    type: "online",
    location: "Google Meet",
    maxStudents: 50,
    currentStudents: 45,
    status: "open"
  }
];

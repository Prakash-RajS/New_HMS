import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  present: Math.floor(15 + Math.random() * 15),
  absent: Math.floor(5 + Math.random() * 5),
  leave: Math.floor(5 + Math.random() * 10),
}));

const departments = [
  "All Departments",
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "Pediatrics",
  "Emergency",
  "Radiology",
  "Housekeeping",
];

const roles = [
  "All Roles",
  "Doctor",
  "Nurse",
  "Lab Technician",
  "Pharmacist",
  "Receptionist",
  "HR",
  "IT Support",
  "Housekeeping",
];

const dateRanges = {
  "Aug 1 - Aug 30": { start: "2025-08-01", end: "2025-08-30" },
  "Sep 1 - Sep 30": { start: "2025-09-01", end: "2025-09-30" },
  "Oct 1 - Oct 31": { start: "2025-10-01", end: "2025-10-31" },
};

const initialRows = [
  {
    name: "Preethi",
    designation: "HR",
    department: "Human Resources",
    role: "HR",
    date: "2025-08-20",
    shift: "09am - 05pm",
    status: "Present",
    checkin: "8.50am",
    checkout: "5.30pm",
    details: "Approved",
    statusColor: "text-blue-500",
    detailsColor: "text-green-500",
  },
  {
    name: "Rajesh",
    designation: "Accounts Manager",
    department: "Finance",
    role: "Doctor",
    date: "2025-08-20",
    shift: "09am - 05pm",
    status: "Present",
    checkin: "8.50am",
    checkout: "5.30pm",
    details: "Pending",
    statusColor: "text-blue-500",
    detailsColor: "text-yellow-500",
  },
  {
    name: "Krishna",
    designation: "System Admin",
    department: "IT & Systems",
    role: "IT Support",
    date: "2025-08-19",
    shift: "09am - 05pm",
    status: "Absent",
    checkin: "-",
    checkout: "-",
    details: "Approved",
    statusColor: "text-red-500",
    detailsColor: "text-green-500",
  },
  {
    name: "Raghul",
    designation: "Housekeeping",
    department: "Housekeeping & Maintenance",
    role: "Housekeeping",
    date: "2025-08-18",
    shift: "09am - 05pm",
    status: "Present",
    checkin: "8.50am",
    checkout: "5.30pm",
    details: "Approved",
    statusColor: "text-blue-500",
    detailsColor: "text-green-500",
  },
];

const AttendanceTracking = () => {
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [dateRange, setDateRange] = useState("Aug 1 - Aug 30");
  const [rows] = useState(initialRows);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const dropdownStyle = {
    backgroundImage: `linear-gradient(to right, #14DC6F, #09753A)`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    color: "white",
  };

  const filteredRows = rows.filter((row) => {
    const rowDate = new Date(row.date);
    const { start, end } = dateRanges[dateRange];
    const startD = new Date(start);
    const endD = new Date(end);

    const inDateRange = rowDate >= startD && rowDate <= endD;
    const inDept =
      selectedDept === "All Departments" || row.department === selectedDept;
    const inRole = selectedRole === "All Roles" || row.role === selectedRole;

    return inDateRange && inDept && inRole;
  });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredRows.map((_, i) => i));
    }
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, "attendance.xlsx");
  };

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="w-[201px] h-[24px] mb-6 font-inter font-medium text-[20px] text-white">
        Attendance Tracking
      </h1>

      <div className="w-[1092px] h-[114px] grid grid-cols-4 gap-[24px] mb-8">
        {[
          { title: "Total Present", value: 152 },
          { title: "Total Absent", value: 10 },
          { title: "On Leave", value: 18 },
          { title: "Pending Review", value: 20 },
        ].map((card, i) => (
          <div
            key={i}
            className="w-[255px] h-[114px] bg-[#000000] border border-[#2B2B2B] rounded-[12px] p-4 flex flex-col items-start gap-2"
          >
            <p className="font-inter font-medium text-[16px] text-white">
              {card.title}
            </p>
            <p className="text-[12px] text-[#A0A0A0]">+12 this week ↗</p>
            <p className="text-[26px] font-semibold bg-gradient-to-r from-[#14DC6F] to-[#09753A] text-transparent bg-clip-text">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between w-[1092px] h-[70px] mb-2 gap-6 opacity-100">
        <div className="flex space-x-6">
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Department</label>
            <select
              className="w-[268px] h-[40px] bg-black border border-green-500 text-white rounded-[20px] px-3 py-2 shadow-sm focus:outline-none appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%2300FF00'><path d='M7 10l5 5 5-5z'/></svg>')] bg-no-repeat bg-right-2 bg-center"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {departments.map((d, i) => (
                <option key={i} className="bg-black text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Roles</label>
            <select
              className="w-[268px] h-[40px] bg-black border border-green-500 text-white rounded-[20px] px-3 py-2 shadow-sm focus:outline-none appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%2300FF00'><path d='M7 10l5 5 5-5z'/></svg>')] bg-no-repeat bg-right-2 bg-center"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {roles.map((r, i) => (
                <option key={i} className="bg-black text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Dates Range</label>
            <select
              className="w-[268px] h-[40px] bg-black border border-green-500 text-white rounded-[20px] px-3 py-2 shadow-sm focus:outline-none appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%2300FF00'><path d='M7 10l5 5 5-5z'/></svg>')] bg-no-repeat bg-right-2 bg-center"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {Object.keys(dateRanges).map((range, i) => (
                <option key={i} className="bg-black text-white">
                  {range}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="w-[216px] h-[54px] bg-[#0EFF7B1A] border border-[#0EFF7B4D] rounded-[12px] px-3 py-1 text-white font-medium text-sm flex items-center justify-center gap-1"
        >
          Export
        </button>
      </div>

      <div className="bg-black rounded-xl p-6 mb-8 w-[1053px]">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="day" stroke="#ffffff" />
            <YAxis stroke="#ffffff" domain={[0, 35]} />
            <Tooltip />
            <Legend verticalAlign="top" align="right" />
            <Line
              type="monotone"
              dataKey="present"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Present"
            />
            <Line
              type="monotone"
              dataKey="absent"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              name="Absent"
            />
            <Line
              type="monotone"
              dataKey="leave"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="On Leave"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-neutral-900 rounded-xl overflow-hidden w-[1092px] opacity-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-800 text-[#ffffff] text-sm">
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3">Name</th>
              <th className="p-3">Designation</th>
              <th className="p-3">Department</th>
              <th className="p-3">Role</th>
              <th className="p-3">Date</th>
              <th className="p-3">Shift time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Check In</th>
              <th className="p-3">Check Out</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>
          <tbody className="text-gray-200 text-sm">
            {filteredRows.length === 0 ? (
              <tr className="bg-black">
                <td colSpan="11" className="text-center p-4 text-gray-400">
                  No records found
                </td>
              </tr>
            ) : (
              filteredRows.map((row, i) => (
                <tr
                  key={i}
                  className="bg-black border-t border-neutral-800 hover:bg-neutral-800"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(i)}
                      onChange={() => handleRowSelect(i)}
                    />
                  </td>
                  <td className="p-3">{row.name}</td>
                  <td className="p-3">{row.designation}</td>
                  <td className="p-3">{row.department}</td>
                  <td className="p-3">{row.role}</td>
                  <td className="p-3">{row.date}</td>
                  <td className="p-3">{row.shift}</td>
                  <td className={`p-3 ${row.statusColor}`}>{row.status}</td>
                  <td className="p-3">{row.checkin}</td>
                  <td className="p-3">{row.checkout}</td>
                  <td className={`p-3 ${row.detailsColor}`}>{row.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTracking;

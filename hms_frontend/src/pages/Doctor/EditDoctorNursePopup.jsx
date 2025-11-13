import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { successToast, errorToast } from "../../components/Toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE = "http://127.0.0.1:8000";

const EditDoctorNursePopup = ({ onClose, profile, onUpdate }) => {
  // Safety: Close if no profile
  useEffect(() => {
    if (!profile) {
      errorToast("Profile data is missing");
      onClose();
    }
  }, [profile, onClose]);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    specialization: "",
    date_of_joining: "",
    status: "Active"
  });
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]); // Store full objects

  // Fetch departments + prefill
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(`${API_BASE}/departments/`);
        if (res.ok) {
          const data = await res.json();
          setDepartments(data); // [{id, name}, ...]
        }
      } catch (err) {
        console.error("Failed to load departments", err);
      }
    };

    fetchDepartments();

    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        department: profile.department || "",
        designation: profile.designation || "",
        specialization: profile.specialization || "",
        date_of_joining: profile.date_of_joining || "",
        status: profile.status || "Active"
      });
    }
  }, [profile]);

  const handleUpdate = async () => {
    if (!formData.full_name || !formData.email || !formData.phone) {
      errorToast("Please fill all required fields");
      return;
    }

    if (!profile?.id) {
      errorToast("Invalid profile");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("full_name", formData.full_name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);

      const dept = departments.find(d => d.name === formData.department);
      if (dept) formDataToSend.append("department_id", dept.id);

      if (formData.designation) formDataToSend.append("designation", formData.designation);
      if (formData.specialization) formDataToSend.append("specialization", formData.specialization);
      if (formData.status) formDataToSend.append("status", formData.status);

      if (formData.date_of_joining) {
        let date = formData.date_of_joining;
        if (date.includes('-')) {
          const [y, m, d] = date.split('-');
          date = `${m}/${d}/${y}`;
        }
        formDataToSend.append("date_of_joining", date);
      }

      const response = await fetch(`${API_BASE}/staff/update/${profile.id}/`, {
        method: 'PUT',
        body: formDataToSend
      });

      if (response.ok) {
        const updatedStaff = await response.json();
        successToast("Profile updated successfully");
        onUpdate(updatedStaff); // Pass fresh data
        onClose();
      } else {
        let msg = "Failed to update profile";
        try {
          const err = await response.json();
          msg = err.detail || msg;
        } catch {}
        errorToast(msg);
      }
    } catch (error) {
      console.error("Update error:", error);
      errorToast("Network error");
    } finally {
      setLoading(false);
    }
  };

  const roles = ["Doctor", "Nurse", "Staff"];
  const statuses = ["Active", "Inactive"];

  const Dropdown = ({ label, value, onChange, options }) => (
    <div>
      <label className="text-sm text-black dark:text-white">{label}</label>
      <Listbox value={value || "Select"} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]">
            {value || "Select"}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-full max-h-60 rounded-[12px] bg-white dark:bg-black shadow-lg z-[9999] border border-[#0EFF7B] dark:border-[#3A3A3A] overflow-auto">
            {options.map((opt, i) => (
              <Listbox.Option
                key={i}
                value={opt}
                className={({ active, selected }) =>
                  `cursor-pointer py-2 px-2 text-sm ${active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33]" : ""} ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"}`
                }
              >
                {opt}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('/')) {
      const [m, d, y] = dateStr.split('/');
      return new Date(y, m - 1, d);
    }
    return new Date(dateStr);
  };

  if (!profile) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9990]">
      <div className="w-[504px] h-[520px] rounded-[20px] bg-white dark:bg-[#000000E5] p-6 relative overflow-hidden">
        <div style={{ position: "absolute", inset: 0, borderRadius: "20px", padding: "2px", background: "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none" }}></div>

        <div className="flex justify-between items-center pb-3 mb-4 relative z-10">
          <h3 className="font-medium text-[16px]">Edit Doctor/Nurse</h3>
          <button onClick={onClose} disabled={loading} className="w-6 h-6 rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] flex items-center justify-center hover:bg-[#0EFF7B33]">
            <X size={16} className="text-[#08994A] dark:text-white" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 relative z-10">
          <div>
            <label className="text-sm">Full Name *</label>
            <input
              value={formData.full_name}
              onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Enter full name"
              disabled={loading}
              className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] outline-none disabled:opacity-50"
            />
          </div>

          <Dropdown label="Role" value={formData.designation} onChange={v => setFormData({ ...formData, designation: v })} options={roles} />
          <Dropdown label="Department" value={formData.department} onChange={v => setFormData({ ...formData, department: v })} options={departments.map(d => d.name)} />
          
          <div>
            <label className="text-sm">Specialization</label>
            <input
              value={formData.specialization}
              onChange={e => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="Enter specialization"
              disabled={loading}
              className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-sm">Phone Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone"
              maxLength="10"
              disabled={loading}
              className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-sm">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
              disabled={loading}
              className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-sm">Joining Date</label>
            <div className="relative">
              <DatePicker
                selected={formatDateForDisplay(formData.date_of_joining)}
                onChange={date => {
                  const formatted = date ? `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}` : "";
                  setFormData({ ...formData, date_of_joining: formatted });
                }}
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                disabled={loading}
                className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] outline-none"
                wrapperClassName="w-full"
                popperClassName="z-[9999]"
              />
              <div className="absolute right-3 top-2.5 pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#08994A] dark:text-[#0EFF7B]">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>
          </div>

          <Dropdown label="Status" value={formData.status} onChange={v => setFormData({ ...formData, status: v })} options={statuses} />
        </div>

        <div className="flex justify-center gap-4 mt-8 relative z-10">
          <button onClick={onClose} disabled={loading} className="w-[104px] h-[33px] rounded-[8px] border border-[#0EFF7B] bg-white dark:bg-transparent text-[#08994A] dark:text-white hover:bg-[#0EFF7B1A] disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            style={{ background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)" }}
            className="w-[104px] h-[33px] rounded-[8px] border-b-[2px] border-[#0EFF7B66] text-white hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDoctorNursePopup;
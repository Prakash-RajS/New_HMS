import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, Edit, ArrowLeft, X ,Users, Activity, Star} from "lucide-react";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "Dr. David Miller",
    gender: "Female",
    age: "42",
    bloodGroup: "A+",
    contact: "+91 62742 xxxx",
    email: "Davidmiller52@gmail.com",
    education: "MBBS, FCPS",
    quote: "Dr. Smith is dedicated to providing compassionate, patient-centered care, focusing on minimally invasive techniques for faster recovery.",
    experience: "10+ years",
    department: "Orthopaedics",
    licenseNumber: "MD-2346-U735",
    specialization: "Joint Replacement",
    boardCertifications: "American Board of Orthopedic Surgery",
    professionalMemberships: "American Medical Association (AMA)",
    languagesSpoken: "English",
    awards: "Top Doctor awards, hospital honors",
  });

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", formData);
    setShowEditModal(false);
    // In a real app, this would update the backend or state management
  };

  return (
    // <div className="min-h-screen mt-[60px] bg-white dark:bg-black text-black dark:text-white p-6">
      <div
      className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-8 w-full max-w-[1400px] mx-auto flex flex-col bg-white dark:bg-transparent overflow-hidden relative"
    >
      <div
        className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
          zIndex: 0,
        }}
      ></div>
      {/* Gradient Border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "10px",
          padding: "2px",
          background:
            "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
          zIndex: 0,
        }}
      ></div>
      {/* Back Button */}
      <div className="mb-6">
          <button
            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2 rounded-[8px] hover:bg-[#0EFF7B1A] border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66] dark:hover:bg-green-600 text-white dark:text-white text-sm md:text-base"
            onClick={() => navigate(-1)}
            style={{
              background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
            }}
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>
      <div className="text-black dark:text-white font-medium text-[20px] mb-4">Doctor/Nurse Profile</div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Section */}
<div className=" bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-[#0EFF7B] dark:border-[#3C3C3C]">
  {/* Edit Button - inside top right */}
   <div className="flex justify-end mb-4">
    <button
      className="text-[#08994A] dark:text-[#0EFF7B] w-[45px] h-[45px] p-3 rounded-full bg-[#F5F6F5] dark:bg-neutral-800 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B33] flex items-center justify-center"
      onClick={handleEditClick}
    >
      <Edit size={18} />
    </button>
  </div>

          {/* Profile */}
          <div className="flex items-start gap-7">
            <div className="min-w-[192px] h-[264px] rounded-lg bg-gray-200 dark:bg-neutral-800"></div>
            <div className="mt-[100px]">
              <span className="w-[108px] h-[35px] flex items-center justify-center gap-2 rounded-[30px] border border-[#0EFF7B] dark:border-[#0EFF7B] bg-white dark:bg-[#1E1E1E] text-[#08994A] dark:text-[#0EFF7B] text-[12px] px-[10px]">
                <span className="w-[8px] h-[8px] rounded-full bg-[#08994A] dark:bg-[#0EFF7B]"></span>
                Available
              </span>
              <h2 className="text-[26px] font-bold mt-2 text-black dark:text-white">{formData.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">Orthopaedics Surgeon</p>

              <div className="flex gap-3 mt-3">
                <button className="text-[#08994A] dark:text-[#0EFF7B] w-[45px] h-[45px] p-3 rounded-[50px] bg-[#F5F6F5] dark:bg-neutral-800 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B33]">
                  <Phone size={18} />
                </button>
                <button className="text-[#08994A] dark:text-[#0EFF7B] w-[45px] h-[45px] p-3 rounded-[50px] bg-[#F5F6F5] dark:bg-neutral-800 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B33]">
                  <Mail size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="mt-6 text-sm space-y-2">
            <p>
              <span className="text-[17px] font-semibold text-black dark:text-white">Basic Information</span>
            </p>
            <p><span className="text-gray-600 dark:text-white">Gender:</span> <span className="text-[#08994A] dark:text-[#0EFF7B]">{formData.gender}</span></p>
            <p><span className="text-gray-600 dark:text-white">Age:</span> <span className="text-[#08994A] dark:text-[#0EFF7B]">{formData.age}</span></p>
            <p><span className="text-gray-600 dark:text-white">Blood Group:</span> <span className="text-[#08994A] dark:text-[#0EFF7B]">{formData.bloodGroup}</span></p>
            <p><span className="text-gray-600 dark:text-white">Contact:</span> <span className="text-[#08994A] dark:text-[#0EFF7B]">{formData.contact}</span></p>
            <p><span className="text-gray-600 dark:text-white">Email:</span> <span className="text-[#08994A] dark:text-[#0EFF7B]">{formData.email}</span></p>
            <p><span className="text-gray-600 dark:text-white">Education:</span> <span className="text-[#08994A] dark:text-[#0EFF7B]">{formData.education}</span></p>
            <p className="text-black dark:text-white italic text-sm"><span className="text-[#08994A] dark:text-[#0EFF7B]">{formData.quote}</span></p>
          </div>

          {/* About */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-black dark:text-white">About the Physician</h3>
          </div>

          {/* Details */}
          <div className="mt-6 text-sm space-y-2">
            <p><span className="text-gray-600 dark:text-white">Experience:</span> <span className="text-[#08994A] dark:text-[#0EFF7B]">{formData.experience}</span></p>
            <p><span className="text-gray-600 dark:text-white">Department:</span> <span className="text-[#08994A] dark:text-[#0EFF7B]">{formData.department}</span></p>
            <p><span className="text-gray-600 dark:text-white">License Number:</span> <span className="text-[#08994A] dark:text-[#0EFF7B]">{formData.licenseNumber}</span></p>
            <p><span className="text-gray-600 dark:text-white">Specialization:</span> <span className="text-[#08994A] dark:text-[#0EFF7B]">{formData.specialization}</span></p>
            <p><span className="text-gray-600 dark:text-white">Board Certifications:</span> <span className="text-[#08994A] dark:text-[#0EFF7B]">{formData.boardCertifications}</span></p>
            <p><span className="text-gray-600 dark:text-white">Professional Memberships:</span> <span className="text-[#08994A] dark:text-[#0EFF7B]">{formData.professionalMemberships}</span></p>
            <p><span className="text-gray-600 dark:text-white">Languages Spoken:</span> <span className="text-[#08994A] dark:text-[#0EFF7B]">{formData.languagesSpoken}</span></p>
            <p><span className="text-gray-600 dark:text-white">Awards & Recognitions:</span> <span className="text-[#08994A] dark:text-[#0EFF7B]">{formData.awards}</span></p>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl space-y-6 border border-[#0EFF7B] dark:border-[#3C3C3C]">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
  {/* Total Patients */}
  <div className="bg-[#0EFF7B1A] dark:bg-[#000000] p-5 rounded-lg text-center">
    <p className="text-black dark:text-white text-[18px]">Total Patients</p>
    <div className="flex justify-center items-center gap-2">
      <Users size={26} className="text-[#08994A] dark:text-[#0EFF7B]" />
      <p className="text-2xl font-medium text-black dark:text-white">230</p>
    </div>
    <p className="text-green-500 text-[12px]">
      +35% <span className="text-black dark:text-white text-[12px]"> Have increased from yesterday</span>
    </p>
  </div>

  {/* Surgeries */}
  <div className="bg-[#0EFF7B1A] dark:bg-[#000000] p-5 rounded-lg text-center">
    <p className="text-black dark:text-white text-[18px]">Surgeries</p>
    <div className="flex justify-center items-center gap-2">
      <Activity size={26} className="text-[#08994A] dark:text-[#0EFF7B]" />
      <p className="text-2xl font-medium text-black dark:text-white">90</p>
    </div>
    <p className="text-green-500 text-xs">
      95% <span className="text-black dark:text-white text-[12px]">success rate</span>
    </p>
  </div>

  {/* Reviews */}
  <div className="bg-[#0EFF7B1A] dark:bg-[#000000] p-5 rounded-lg text-center">
    <p className="text-black dark:text-white text-[18px]">Reviews</p>
    <div className="flex justify-center items-center gap-2">
      <Star size={26} className="text-[#FFD700]" fill="#FFD700" />
      <p className="text-2xl font-medium text-black dark:text-white">4.5/5.0</p>
    </div>
    <p className="text-black dark:text-white text-xs">Based on patient review</p>
  </div>
</div>

          {/* Patient Visits */}
          <div>
            <h3 className="font-semibold mb-3 text-black dark:text-white">Patient Visits</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[#0EFF7B1A] dark:bg-[#000000] p-4 rounded-[12px]">
                <p className="font-semibold text-black dark:text-white">Routine Check</p>
                <p className="text-blue-400 text-sm">9:00AM - 10:30AM</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs italic">Vital signs & basic assessments</p>
              </div>
              <div className="bg-[#0EFF7B1A] dark:bg-[#000000] p-4 rounded-[12px]">
                <p className="font-semibold text-black dark:text-white">Outpatient Appointments</p>
                <p className="text-blue-400 text-sm">10:00AM - 12:00PM</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs italic">Consultations & follow-ups with OPD cases</p>
              </div>
              <div className="bg-[#0EFF7B1A] dark:bg-[#000000] p-4 rounded-[12px]">
                <p className="font-semibold text-black dark:text-white">Minor Procedures</p>
                <p className="text-blue-400 text-sm">12:00PM - 1:00PM</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs italic">Small treatments, wound checks, post-surgery reviews.</p>
              </div>
              <div className="bg-[#0EFF7B1A] dark:bg-[#000000] p-4 rounded-[12px]">
                <p className="font-semibold text-black dark:text-white">Lunch & Documentation</p>
                <p className="text-blue-400 text-sm">1:00PM - 2:00PM</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs italic">Break time & updating patient records</p>
              </div>
              <div className="bg-[#0EFF7B1A] dark:bg-[#000000] p-4 rounded-[12px]">
                <p className="font-semibold text-black dark:text-white">New Patient Consultations</p>
                <p className="text-blue-400 text-sm">2:00PM - 4:00PM</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs italic">First-time visits and detailed assessments</p>
              </div>
              <div className="bg-[#0EFF7B1A] dark:bg-[#000000] p-4 rounded-[12px]">
                <p className="font-semibold text-black dark:text-white">Outpatient & Emergency</p>
                <p className="text-blue-400 text-sm">4:00PM - 7:00PM</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs italic">Emergency cases & urgent patient care</p>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="font-semibold mb-2 text-black dark:text-white">Availability</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Only on weekdays (Mon-Fri)</p>
            <div className="flex gap-4">
              <span className="px-3 py-1 rounded-md bg-[#F5F6F5] dark:bg-[#0EFF7B1A] border-[2px] border-[#0EFF7B66] text-sm text-black dark:text-white shadow-[0px_0px_4px_0px_#0EFF7B40]">
                9:00AM - 12:00PM
              </span>
              <span className="px-3 py-1 rounded-md bg-[#F5F6F5] dark:bg-[#0EFF7B1A] border-[2px] border-[#0EFF7B66] text-sm text-black dark:text-white shadow-[0px_0px_4px_0px_#0EFF7B40]" >
                4:00PM - 7:00PM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="w-[800px] h-[500px] rounded-[20px]  bg-white dark:bg-black text-black dark:text-white p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md relative flex flex-col">
            <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: "20px",
      padding: "2px",
      background:
        "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
      WebkitMask:
        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
      pointerEvents: "none",
      zIndex: 0,
    }}
  ></div>
            {/* Header */}
            <div className="flex justify-between items-center pb-3 mb-4">
              <h3 className="text-lg font-semibold text-black dark:text-white">Edit Profile</h3>
              <button
                onClick={handleCloseModal}
                className="w-6 h-6 rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] shadow-[0px_0px_4px_0px_#0EFF7B1A] flex items-center justify-center hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
              >
                <X size={16} className="text-[#08994A] dark:text-white" />
              </button>
            </div>

            {/* Form with Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-sm text-black dark:text-white mb-1 block">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full h-[42px] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[8px] px-[12px] py-[8px] text-sm text-black dark:text-white bg-[#F5F6F5] dark:bg-black"
                  />
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white mb-1 block">Gender</label>
                  <input
                    type="text"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full h-[42px] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[8px] px-[12px] py-[8px] text-sm text-black dark:text-white bg-[#F5F6F5] dark:bg-black"
                  />
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white mb-1 block">Age</label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full h-[42px] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[8px] px-[12px] py-[8px] text-sm text-black dark:text-white bg-[#F5F6F5] dark:bg-black"
                  />
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white mb-1 block">Blood Group</label>
                  <input
                    type="text"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full h-[42px] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[8px] px-[12px] py-[8px] text-sm text-black dark:text-white bg-[#F5F6F5] dark:bg-black"
                  />
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white mb-1 block">Contact</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full h-[42px] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[8px] px-[12px] py-[8px] text-sm text-black dark:text-white bg-[#F5F6F5] dark:bg-black"
                  />
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white mb-1 block">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-[42px] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[8px] px-[12px] py-[8px] text-sm text-black dark:text-white bg-[#F5F6F5] dark:bg-black"
                  />
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white mb-1 block">Education</label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="w-full h-[42px] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[8px] px-[12px] py-[8px] text-sm text-black dark:text-white bg-[#F5F6F5] dark:bg-black"
                  />
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white mb-1 block">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full h-[42px] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[8px] px-[12px] py-[8px] text-sm text-black dark:text-white bg-[#F5F6F5] dark:bg-black"
                  />
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white mb-1 block">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full h-[42px] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[8px] px-[12px] py-[8px] text-sm text-black dark:text-white bg-[#F5F6F5] dark:bg-black"
                  />
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white mb-1 block">License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full h-[42px] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[8px] px-[12px] py-[8px] text-sm text-black dark:text-white bg-[#F5F6F5] dark:bg-black"
                  />
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white mb-1 block">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full h-[42px] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[8px] px-[12px] py-[8px] text-sm text-black dark:text-white bg-[#F5F6F5] dark:bg-black"
                  />
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white mb-1 block">Board Certifications</label>
                  <input
                    type="text"
                    name="boardCertifications"
                    value={formData.boardCertifications}
                    onChange={handleInputChange}
                    className="w-full h-[42px] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[8px] px-[12px] py-[8px] text-sm text-black dark:text-white bg-[#F5F6F5] dark:bg-black"
                  />
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white mb-1 block">Professional Memberships</label>
                  <input
                    type="text"
                    name="professionalMemberships"
                    value={formData.professionalMemberships}
                    onChange={handleInputChange}
                    className="w-full h-[42px] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[8px] px-[12px] py-[8px] text-sm text-black dark:text-white bg-[#F5F6F5] dark:bg-black"
                  />
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white mb-1 block">Languages Spoken</label>
                  <input
                    type="text"
                    name="languagesSpoken"
                    value={formData.languagesSpoken}
                    onChange={handleInputChange}
                    className="w-full h-[42px] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[8px] px-[12px] py-[8px] text-sm text-black dark:text-white bg-[#F5F6F5] dark:bg-black"
                  />
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white mb-1 block">Awards & Recognitions</label>
                  <input
                    type="text"
                    name="awards"
                    value={formData.awards}
                    onChange={handleInputChange}
                    className="w-full h-[42px] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[8px] px-[12px] py-[8px] text-sm text-black dark:text-white bg-[#F5F6F5] dark:bg-black"
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-sm text-black dark:text-white mb-1 block">Quote</label>
                  <textarea
                    name="quote"
                    value={formData.quote}
                    onChange={handleInputChange}
                    className="w-full h-[100px] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[8px] px-[12px] py-[8px] text-sm text-black dark:text-white bg-[#F5F6F5] dark:bg-black"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-6 mt-4">
              <button
                onClick={handleCloseModal}
                className="w-[104px] h-[33px] rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent px-3 py-2 flex items-center justify-center gap-2 text-black dark:text-white font-medium text-[14px] leading-[16px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.25)] hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="w-[104px] h-[33px] rounded-[8px] px-3 py-2 flex items-center justify-center gap-2 border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66] text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
              style={{
    background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
  }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <style>
  {`
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}
</style>
    </div>
  );
};

export default DoctorProfile;
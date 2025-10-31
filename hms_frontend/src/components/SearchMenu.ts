// src/components/SearchMenu.ts
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Building2,
  Bed,
  UserCog,
  Pill,
  Boxes,
  ClipboardList,
  DollarSign,
  ReceiptText,
  CreditCard,
  Microscope,
  BarChart3,
  Activity,
  Droplet,
  HeartPulse,
  Ambulance,
  User,
  ShieldCheck,
} from "lucide-react";

// Replicate the exact menu structure from Sidebar
export const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Appointments", path: "/appointments", icon: CalendarDays },

  {
    name: "Patients",
    path: "/patients",
    icon: Users,
    dropdown: [
      { name: "New Registration", path: "/patients/new-registration", icon: User },
      {
        name: "IPD / OPD Patient",
        path: "/patients/ipd-opd",
        paths: ["/patients/ipd-opd", "/patients/out-patients"],
        icon: Bed,
      },
      {
        name: "OPD Patient",
        path: "/patients/out-patients",
        paths: ["/patients/ipd-opd", "/patients/out-patients"],
        icon: Bed,
      },
      {
        name: "Patient Profile",
        path: "/patients/profile",
        paths: ["/patients/profile", "/patients/profile/details"],
        icon: ClipboardList,
      },
    ],
  },

  {
    name: "Administration",
    path: "/Administration",
    icon: Building2,
    dropdown: [
      { name: "Departments", path: "/Administration/Departments", icon: Building2 },
      {
        name: "Room Management",
        path: "/Administration/RoomManagement",
        paths: ["/Administration/roommanagement", "/Administration/BedList", "/Administration/RoomManagement"],
        icon: Bed,
      },
      {
        name: "BedList",
        path: "/Administration/BedList",
        icon: Bed,
      },
      { name: "Staff Management", path: "/Administration/StaffManagement", icon: UserCog },
    ],
  },

  {
    name: "Pharmacy",
    path: "/Pharmacy",
    icon: Pill,
    dropdown: [
      { name: "Stock & Inventory", path: "/Pharmacy/Stock-Inventory", icon: Boxes },
      { name: "Bill", path: "/Pharmacy/Bill", icon: DollarSign },
    ],
  },

  {
    name: "Doctors / Nurse",
    path: "/Doctors-Nurse",
    icon: ShieldCheck,
    dropdown: [
      { name: "Add Doctor / Nurse", path: "/Doctors-Nurse/AddDoctorNurse", icon: User },
      {
        name: "Doctor / Nurse",
        path: "/Doctors-Nurse/DoctorNurseProfile",
        paths: ["/Doctors-Nurse/DoctorNurseProfile", "/Doctors-Nurse/ViewProfile"],
        icon: Users,
      },
      { name: "MedicineAllocation", path: "/Doctors-Nurse/MedicineAllocation", icon: Pill },
    ],
  },

  {
    name: "Clinical Resources",
    path: "/ClinicalResources",
    icon: Microscope,
    dropdown: [
      { name: "Laboratory Reports", path: "/ClinicalResources/Laboratory/LaboratoryReports", icon: BarChart3 },
      { name: "Blood Bank", path: "/ClinicalResources/ClinicalReports/BloodBank", icon: HeartPulse },
      { name: "Donor", path: "/ClinicalResources/ClinicalReports/BloodBank", icon: HeartPulse },
      { name: "Ambulance Management", path: "/ClinicalResources/EmergencyServices/Ambulance", icon: Ambulance },
    ],
  },

  { name: "Billing", path: "/Billing", icon: DollarSign },

  {
    name: "Accounts",
    path: "/UserSettings",
    paths: ["/security", "/UserSettings"],
    icon: UserCog,
  },
];

export type SearchResult = {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  depth: number;
};

export const searchMenu = (query: string): SearchResult[] => {
  if (!query.trim()) return [];

  const results: SearchResult[] = [];
  const q = query.toLowerCase();

  const walk = (items: typeof menuItems, depth: number, parentPath = "") => {
    items.forEach((item) => {
      const label = item.name.toLowerCase();

      if (label.includes(q)) {
        results.push({
          label: item.name,
          path: item.path,
          icon: item.icon,
          depth,
        });
      }

      if (item.dropdown) {
        item.dropdown.forEach((sub) => {
          const subLabel = sub.name.toLowerCase();

          if (subLabel.includes(q)) {
            results.push({
              label: sub.name,
              path: sub.path,
              icon: sub.icon,
              depth: depth + 1,
            });
          }
        });
      }
    });
  };

  walk(menuItems, 0);
  return results.slice(0, 10); // limit results
};
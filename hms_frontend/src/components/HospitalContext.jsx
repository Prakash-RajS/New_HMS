import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import api from "../utils/axiosConfig";
import { useUser } from "../contexts/UserContext";

const HospitalContext = createContext();
export const useHospital = () => useContext(HospitalContext);

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

function normalizeLogo(logo) {
  if (!logo) return null;
  if (logo.startsWith("http")) return logo;
  return `${API_BASE}${logo.startsWith("/") ? logo : `/${logo}`}`;
}

const defaultHospitalInfo = {
  id: null,
  logo: null,
  hospital_name: "Sravan Multispeciality Hospital",
};

export const HospitalProvider = ({ children }) => {
  const { isAuthenticated } = useUser();

  // ✅ Load cached hospital info immediately
  const [hospitalInfo, setHospitalInfo] = useState(() => {
    try {
      const cached = localStorage.getItem("hospitalInfo");
      return cached ? JSON.parse(cached) : defaultHospitalInfo;
    } catch {
      return defaultHospitalInfo;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHospitalInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/settings/all");
      const hospital = res.data?.hospital;

      if (!hospital) throw new Error("Invalid hospital data");

      const newInfo = {
        id: hospital.id,
        hospital_name: hospital.hospital_name || defaultHospitalInfo.hospital_name,
        logo: normalizeLogo(hospital.logo),
        address: hospital.address || "",
        phone: hospital.phone || "",
        email: hospital.email || "",
        website: hospital.website || "",
      };

      setHospitalInfo(newInfo);

      // ✅ Save everything (not just logo)
      localStorage.setItem("hospitalInfo", JSON.stringify(newInfo));

    } catch (err) {

  if (err.response?.status === 401) {
    //console.warn("Hospital fetch skipped (not authenticated)");
    return;
  }

  //console.error("Hospital fetch error:", err);
  setError("Failed to load hospital info");
}finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch once on app load
  useEffect(() => {
    fetchHospitalInfo();
  }, [fetchHospitalInfo]);

  // ✅ Do NOT remove hospital info on logout
  useEffect(() => {
    if (!isAuthenticated) {
      //console.log("User logged out (hospital cache kept)");
    }
  }, [isAuthenticated]);

  const updateLogo = (logoUrl) => {
    const normalized = normalizeLogo(logoUrl);

    setHospitalInfo((prev) => {
      const updated = { ...prev, logo: normalized };
      localStorage.setItem("hospitalInfo", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <HospitalContext.Provider
      value={{
        hospitalInfo,
        loading,
        error,
        refreshHospitalInfo: fetchHospitalInfo,
        updateLogo,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};


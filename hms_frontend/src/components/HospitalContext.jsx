// hms_frontend/src/components/HospitalContext.jsx

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import api, { getMediaUrl } from "../utils/axiosConfig";
import { useUser } from "../contexts/UserContext"; // ✅ auth context

const HospitalContext = createContext();

export const useHospital = () => useContext(HospitalContext);

export const HospitalProvider = ({ children }) => {
  const { isAuthenticated } = useUser(); // ✅ auth-ready signal

  const [hospitalInfo, setHospitalInfo] = useState({
    id: null,
    logo: null,
    hospital_name: "Sravan Multispeciality Hospital",
    address: "",
    phone: "",
    email: "",
    gstin: "",
    emergency_contact: "",
    website: "",
    tagline: "",
    established_year: null,
    registration_number: "",
    working_hours: {},
    updated_at: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch hospital info
   * Runs ONLY after authentication is ready
   */
  const fetchHospitalInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/all");
      const hospitalData = response.data?.hospital;

      if (!hospitalData) {
        throw new Error("Invalid hospital response");
      }

      setHospitalInfo({
        id: hospitalData.id || null,
        logo: hospitalData.logo ? getMediaUrl(hospitalData.logo) : null,
        hospital_name:
          hospitalData.hospital_name || "Sravan Multispeciality Hospital",
        address: hospitalData.address || "",
        phone: hospitalData.phone || "",
        email: hospitalData.email || "",
        gstin: hospitalData.gstin || "",
        emergency_contact: hospitalData.emergency_contact || "",
        website: hospitalData.website || "",
        tagline: hospitalData.tagline || "",
        established_year: hospitalData.established_year || null,
        registration_number: hospitalData.registration_number || "",
        working_hours: hospitalData.working_hours || {},
        updated_at: hospitalData.updated_at || null,
      });
    } catch (err) {
      console.error("Error fetching hospital info:", err);

      // ❗ Ignore 401 (auth flow will handle redirect)
      if (err.response?.status !== 401) {
        setError("Failed to load hospital information");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ✅ Trigger fetch ONLY after login
   */
  useEffect(() => {
    if (isAuthenticated) {
      fetchHospitalInfo();
    } else {
      // 🔐 Clear hospital data on logout
      setHospitalInfo((prev) => ({
        ...prev,
        id: null,
        logo: null,
      }));
    }
  }, [isAuthenticated, fetchHospitalInfo]);

  /**
   * Update logo locally (instant UI update)
   */
  const updateLogo = (logoPath) => {
    setHospitalInfo((prev) => ({
      ...prev,
      logo: logoPath ? getMediaUrl(logoPath) : null,
    }));
  };

  /**
   * Update hospital info locally
   */
  const updateHospitalInfo = (newInfo) => {
    setHospitalInfo((prev) => ({
      ...prev,
      ...newInfo,
      logo: newInfo.logo ? getMediaUrl(newInfo.logo) : prev.logo,
    }));
  };

  return (
    <HospitalContext.Provider
      value={{
        hospitalInfo,
        loading,
        error,
        refreshHospitalInfo: fetchHospitalInfo,
        updateLogo,
        updateHospitalInfo,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

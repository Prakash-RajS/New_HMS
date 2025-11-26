// src/context/PermissionContext.jsx  (or wherever you keep it)

import React, { createContext, useContext, useState, useEffect } from "react";

const PermissionContext = createContext();

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = localStorage.getItem("userData");

        if (!userData) {
          console.log("No user data in localStorage");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userData);

        // CRITICAL FIX: Convert Django integer booleans → real booleans
        user.is_superuser = !!user.is_superuser; // 1 → true, 0 → false

        setCurrentUser(user);

        // Convert permissions array → object { "patients_view": true }
        const permissionsObj = {};
        user.permissions?.forEach((perm) => {
          permissionsObj[perm.module] = !!perm.enabled; // also ensure boolean
        });

        setPermissions(permissionsObj);

        console.log("Permissions loaded:", permissionsObj);
        console.log("User role:", user.role);
        console.log("Is superuser:", user.is_superuser); // now correct!
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    window.addEventListener("storage", loadUserData);
    window.addEventListener("loginEvent", loadUserData);
    return () => {
      window.removeEventListener("storage", loadUserData);
      window.removeEventListener("loginEvent", loadUserData);
    };
  }, []);

  const hasPermission = (module) => {
    if (loading) return false;

    // Superuser & Admin get FULL access
    const isSuperuser = !!currentUser?.is_superuser;
    const isAdmin = currentUser?.role?.toLowerCase() === "admin";

    if (isSuperuser || isAdmin) {
      return true;
    }

    // Regular user: check specific permission
    return permissions[module] === true;
  };

  const refreshPermissions = () => {
    const userData = localStorage.getItem("userData");
    if (!userData) return;

    const user = JSON.parse(userData);
    user.is_superuser = !!user.is_superuser; // keep it boolean

    const permissionsObj = {};
    user.permissions?.forEach((perm) => {
      permissionsObj[perm.module] = !!perm.enabled;
    });

    setPermissions(permissionsObj);
    setCurrentUser(user); // optional: update user too
  };

  return (
    <PermissionContext.Provider
      value={{
        currentUser,
        permissions,
        hasPermission,
        loading,
        refreshPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export { PermissionContext };

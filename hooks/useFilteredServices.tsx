
import { useMemo } from 'react';
import { UserRole, Service, LocationType } from '../types';
import { ALL_SERVICES } from '../config/servicesConfig';
import { useAppConfig } from '../contexts/AppConfigContext';

export const useFilteredServices = (userRole: UserRole): Service[] => {
  const { institutionType, institutionName } = useAppConfig();

  const filteredServices = useMemo(() => {
    // --- SPECIAL OVERRIDE FOR MANGMAT SCHOOL ---
    // Checks if the institution name contains specific keywords
    const isMasterSchool = institutionName.includes("Education Sarthi") || institutionName.includes("Mangmat");

    return ALL_SERVICES.filter(service => {
        // --- GOD MODE FOR ADMIN ---
        // If it is the Master School AND the user is an Admin, show EVERYTHING (ignore restrictions)
        if (isMasterSchool && userRole === UserRole.Admin) {
            return true;
        }

        // Standard Filtering for other users (Students/Teachers)
        // 1. Role Check: Is this tool meant for this user?
        const roleMatch = service.roles.includes(userRole);
        
        // 2. Institution Check: Does this tool belong to this school type?
        // (Master School shows all types if not filtered by role above)
        const typeMatch = isMasterSchool ? true : (
            !service.institutionTypes || 
            service.institutionTypes.length === 0 || 
            service.institutionTypes.includes(institutionType)
        );

        return roleMatch && typeMatch;
    });
  }, [userRole, institutionType, institutionName]);

  return filteredServices;
};

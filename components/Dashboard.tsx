
import React, { useState, useEffect } from 'react';
import { UserRole, User, ServiceName } from '../types';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';
import ParentDashboard from './ParentDashboard';
import CorporateHiringPortal from './CorporateHiringPortal'; 
import DirectorDashboard from './DirectorDashboard';
import ITIDashboard from './ITIDashboard';
import MedicalDashboard from './MedicalDashboard';
import CollegeDashboard from './CollegeDashboard';
import MangmatCompanyHQ from './MangmatCompanyHQ';

interface DashboardProps {
  user: User;
  activeService: ServiceName | 'overview';
  setActiveService: (service: ServiceName | 'overview') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, activeService, setActiveService }) => {
    const commonProps = { user, activeService, setActiveService };

    if (activeService === 'Corporate Hiring Panel') {
        return <CorporateHiringPortal user={user} />;
    }

    // The wrapper is transparent to allow the global water theme to show through
    return (
        <div className="relative h-full w-full">
            {(() => {
                switch (user.role) {
                  case UserRole.Admin:
                  case UserRole.School:
                    return <AdminDashboard {...commonProps} />;
                  case UserRole.College:
                  case UserRole.University:
                    return <CollegeDashboard {...commonProps} />;
                  case UserRole.Student:
                  case UserRole.JobSeeker:
                    return <StudentDashboard {...commonProps} />;
                  case UserRole.Teacher: 
                    return <TeacherDashboard {...commonProps} />;
                  case UserRole.Parent: 
                    return <ParentDashboard {...commonProps} />;
                  case UserRole.Director: 
                    return <DirectorDashboard {...commonProps} />;
                  case UserRole.Company:
                    return <CorporateHiringPortal user={user} />;
                  case UserRole.ITI:
                  case UserRole.TechnicalInstitute:
                    return <ITIDashboard {...commonProps} />;
                  case UserRole.Medical:
                  case UserRole.Nurse:
                    return <MedicalDashboard {...commonProps} />;
                  default: 
                    return <StudentDashboard {...commonProps} />;
                }
            })()}
        </div>
    );
};

export default Dashboard;

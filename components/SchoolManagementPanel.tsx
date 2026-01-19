
import React from 'react';
import { ServiceName } from '../types';
import ManagementPanel from './ManagementPanel';

interface Props {
  setActiveService: (service: ServiceName | 'overview') => void;
}

const SchoolManagementPanel: React.FC<Props> = ({ setActiveService }) => {
  const config = {
    panelTitle: "School Admin (स्कूल प्रशासन)",
    sections: [
      {
        title: "Admissions & CRM (दाखिला और रिकॉर्ड)",
        services: ['Smart Admissions', 'Student Database', 'Lead Generator', 'AI Certificate Generator', 'Corporate Hiring Panel'] as ServiceName[]
      },
      {
        title: "Academic Operations (शिक्षण और संचालन)",
        services: ['Syllabus Tracker', 'Automated Timetable Generator', 'Digital Notice Board', 'Smart Proxy Manager', 'AI Teacher Evaluator'] as ServiceName[]
      },
      {
        title: "Finance & HR (फीस और वेतन)",
        // Added 'AI Business Manager' here
        services: ['AI Business Manager', 'Fee Management', 'Fee Notification', 'Auto-Dialer', 'Smart HR Manager', 'Profit Calculator'] as ServiceName[]
      },
      {
        title: "Logistics & Safety (सुरक्षा और परिवहन)",
        services: ['Smart Transport', 'Inventory Manager', 'Visitor Management', 'Safety SOS', 'Infirmary'] as ServiceName[]
      }
    ]
  };

  return <ManagementPanel config={config} handleServiceSelect={setActiveService} />;
};

export default SchoolManagementPanel;


import React from 'react';
import { ServiceName } from '../types';
import ManagementPanel from './ManagementPanel';

interface Props {
  setActiveService: (service: ServiceName | 'overview') => void;
}

const InstituteManagementPanel: React.FC<Props> = ({ setActiveService }) => {
  const config = {
    panelTitle: "ITI / Institute Admin (तकनीकी संस्थान प्रशासन)",
    sections: [
      {
        title: "Trade & Practical (ट्रेड और प्रैक्टिकल)",
        services: ['AI ITI Guru', 'Skill Marketplace', 'AI Machine Workshop', 'Interactive 3D Lab', 'AI Virtual Lab'] as ServiceName[]
      },
      {
        title: "Jobs & Careers (रोजगार और करियर)",
        services: ['Recruitment Prep Guru', 'CV Generator', 'Placement Forum', 'AI Interview Coach'] as ServiceName[]
      },
      {
        title: "Administration (प्रशासन)",
        services: ['Fee Management', 'Student Database', 'Digital Notice Board', 'Attendance Log', 'Face Attendance'] as ServiceName[]
      }
    ]
  };

  return <ManagementPanel config={config} handleServiceSelect={setActiveService} />;
};

export default InstituteManagementPanel;

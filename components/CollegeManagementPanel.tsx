
import React from 'react';
import { ServiceName } from '../types';
import ManagementPanel from './ManagementPanel';

interface Props {
  setActiveService: (service: ServiceName | 'overview') => void;
}

const CollegeManagementPanel: React.FC<Props> = ({ setActiveService }) => {
  const config = {
    panelTitle: "College Admin (महाविद्यालय प्रशासन)",
    sections: [
      {
        title: "Placement & Jobs (प्लेसमेंट और करियर)",
        services: ['Placement Forum', 'CV Generator', 'Skill Marketplace', 'AI Interview Coach', 'Career Simulator', 'Psychometric Test'] as ServiceName[]
      },
      {
        title: "Academic & Exam (शिक्षा और परीक्षा)",
        services: ['Online Exam', 'Test Paper Guru', 'Career Predictor', 'Fee Management', 'Alumni Connect', 'Syllabus Tracker'] as ServiceName[]
      },
      {
        title: "Campus & Store (कैंपस और स्टोर)",
        services: ['Campus Kart', 'Inventory Manager', 'Smart HR Manager', 'Visitor Management', 'Smart Canteen', 'Digital Notice Board'] as ServiceName[]
      }
    ]
  };

  return <ManagementPanel config={config} handleServiceSelect={setActiveService} />;
};

export default CollegeManagementPanel;

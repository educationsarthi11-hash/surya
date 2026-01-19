
import { LocationType } from '../types';

export const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "International / Global"
].sort();

export const INSTITUTIONS_BY_STATE: { [state: string]: { [type in LocationType]?: string[] | { [board: string]: string[] } } } = {
    "Delhi": {
        [LocationType.University]: ["Delhi University", "JNU", "IIT Delhi", "AIIMS Delhi", "DTU"],
        [LocationType.School]: {
            "CBSE": ["Modern School", "DPS RK Puram", "Sanskriti School"],
            "IB": ["British School", "Pathways World School"]
        }
    },
    "Maharashtra": {
        [LocationType.University]: ["Mumbai University", "IIT Bombay", "Pune University", "NMIMS"],
        [LocationType.School]: {
            "ICSE": ["Cathedral & John Connon", "Campanion School"],
            "CBSE": ["Podar International", "Ryan International"]
        }
    },
    "International / Global": {
        [LocationType.University]: ["Harvard University (USA)", "Oxford University (UK)", "Stanford University (USA)", "MIT (USA)", "Cambridge University (UK)", "National University of Singapore (NUS)"],
        [LocationType.School]: {
            "International Baccalaureate (IB)": ["Global IB Schools Network", "American International School"],
            "Cambridge (CIE)": ["British International Schools", "CIE Global Centers"],
            "American Curriculum (AP)": ["U.S. Overseas Schools", "Global AP Centers"]
        },
        [LocationType.TechnicalInstitute]: ["AWS Training Academy", "Google Cloud Learning", "Cisco Networking Academy", "Microsoft Certified Centers"]
    }
};

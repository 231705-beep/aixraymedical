import { RiskLevel } from '../entities/ai-report.entity';

export interface MedicalCase {
    case_id: number;
    xray_type: string;
    specialization: string;
    disease: string;
    description: string;
    image_path: string;
    riskLevel: RiskLevel; // Kept internal for logic, but UI will use it
}

export const MEDICAL_CASE_DATASET: MedicalCase[] = [
    // Pulmonology / Respiratory
    {
        case_id: 1,
        xray_type: "Chest",
        specialization: "Pulmonology (Thorax)",
        disease: "Pneumonia",
        description: "Chest X-ray showing lung opacity consistent with pneumonia.",
        image_path: "dataset/chest/pneumonia_01.png",
        riskLevel: RiskLevel.HIGH
    },
    {
        case_id: 2,
        xray_type: "Chest",
        specialization: "Pulmonology (Thorax)",
        disease: "Tuberculosis",
        description: "Upper lobe cavitary lesions and hilar lymphadenopathy indicative of TB.",
        image_path: "dataset/chest/tb_01.png",
        riskLevel: RiskLevel.HIGH
    },
    {
        case_id: 3,
        xray_type: "Chest",
        specialization: "Pulmonology (Thorax)",
        disease: "COVID-19",
        description: "Bilateral ground-glass opacities with peripheral distribution.",
        image_path: "dataset/chest/covid_01.png",
        riskLevel: RiskLevel.CRITICAL
    },
    {
        case_id: 4,
        xray_type: "Chest",
        specialization: "Pulmonology (Thorax)",
        disease: "Pleural Effusion",
        description: "Blunting of the costophrenic angle indicating fluid accumulation.",
        image_path: "dataset/chest/effusion_01.png",
        riskLevel: RiskLevel.MODERATE
    },
    // Cardiology
    {
        case_id: 5,
        xray_type: "Chest (PA)",
        specialization: "Cardiology",
        disease: "Cardiomegaly",
        description: "Enlarged cardiac silhouette with cardiothoracic ratio > 0.5.",
        image_path: "dataset/cardio/heart_enlarged_01.png",
        riskLevel: RiskLevel.MODERATE
    },
    {
        case_id: 6,
        xray_type: "Chest",
        specialization: "Cardiology",
        disease: "Pulmonary Edema",
        description: "Kerley B lines and bat-wing opacities suggesting heart failure.",
        image_path: "dataset/cardio/edema_01.png",
        riskLevel: RiskLevel.HIGH
    },
    // Orthopedics
    {
        case_id: 7,
        xray_type: "Chest/Ribs",
        specialization: "Orthopedics",
        disease: "Rib Fracture",
        description: "Visible discontinuity in the 4th lateral rib segment.",
        image_path: "dataset/ortho/rib_fracture_01.png",
        riskLevel: RiskLevel.MODERATE
    },
    {
        case_id: 8,
        xray_type: "Shoulder",
        specialization: "Orthopedics",
        disease: "Shoulder Dislocation",
        description: "Humeral head displaced anteriorly from the glenoid fossa.",
        image_path: "dataset/ortho/dislocation_01.png",
        riskLevel: RiskLevel.HIGH
    },
    {
        case_id: 9,
        xray_type: "Spine",
        specialization: "Orthopedics",
        disease: "Scoliosis",
        description: "S-shaped lateral curvature of the thoracic spine.",
        image_path: "dataset/ortho/scoliosis_01.png",
        riskLevel: RiskLevel.LOW
    },
    {
        case_id: 10,
        xray_type: "Hand",
        specialization: "Orthopedics",
        disease: "Distal Radius Fracture",
        description: "Fracture of the distal forearm near the wrist joint.",
        image_path: "dataset/ortho/wrist_fracture_01.png",
        riskLevel: RiskLevel.MODERATE
    },
    // Radiology
    {
        case_id: 11,
        xray_type: "Chest",
        specialization: "Radiology",
        disease: "Pneumothorax",
        description: "Separation of visceral pleura from chest wall; lung collapse.",
        image_path: "dataset/radio/pneumothorax_01.png",
        riskLevel: RiskLevel.CRITICAL
    },
    {
        case_id: 12,
        xray_type: "Chest",
        specialization: "Radiology",
        disease: "Hilar Lymphadenopathy",
        description: "Enlargement of lymph nodes in the lung root area.",
        image_path: "dataset/radio/hilar_nodes_01.png",
        riskLevel: RiskLevel.MODERATE
    },
    // Oncology
    {
        case_id: 13,
        xray_type: "Chest",
        specialization: "Oncology",
        disease: "Lung Cancer (Nodule)",
        description: "Spiculated solitary pulmonary nodule in the right upper lobe.",
        image_path: "dataset/onco/nodule_01.png",
        riskLevel: RiskLevel.CRITICAL
    },
    {
        case_id: 14,
        xray_type: "Chest",
        specialization: "Oncology",
        disease: "Metastatic Disease",
        description: "Multiple discrete round opacities (cannonball lesions).",
        image_path: "dataset/onco/metastasis_01.png",
        riskLevel: RiskLevel.HIGH
    },
    // Pediatrics
    {
        case_id: 15,
        xray_type: "Pediatric Chest",
        specialization: "Pediatrics",
        disease: "Bronchiolitis",
        description: "Hyperinflation and peribronchial thickening in a child.",
        image_path: "dataset/pedi/bronchiolitis_01.png",
        riskLevel: RiskLevel.LOW
    },
    {
        case_id: 16,
        xray_type: "Pediatric Chest",
        specialization: "Pediatrics",
        disease: "Cystic Fibrosis",
        description: "Bronchiectasis and mucus plugging consistent with CF.",
        image_path: "dataset/pedi/cf_01.png",
        riskLevel: RiskLevel.HIGH
    },
    // Neurology
    {
        case_id: 17,
        xray_type: "Skull",
        specialization: "Neurology",
        disease: "Skull Fracture",
        description: "Linear fracture line across the temporal bone.",
        image_path: "dataset/neuro/skull_fracture_01.png",
        riskLevel: RiskLevel.HIGH
    },
    {
        case_id: 18,
        xray_type: "Neck (C-Spine)",
        specialization: "Neurology",
        disease: "Cervical Spondylosis",
        description: "Degenerative changes in the cervical vertebrae.",
        image_path: "dataset/neuro/cspine_01.png",
        riskLevel: RiskLevel.LOW
    },
    // General Medicine / Normal
    {
        case_id: 19,
        xray_type: "Chest",
        specialization: "General Medicine",
        disease: "Normal / Healthy",
        description: "Clear lung fields, normal heart size, no fractures seen.",
        image_path: "dataset/general/normal_01.png",
        riskLevel: RiskLevel.LOW
    },
    {
        case_id: 20,
        xray_type: "Chest",
        specialization: "General Medicine",
        disease: "Emphysema",
        description: "Hyperinflated lungs and flattened diaphragms (COPD).",
        image_path: "dataset/general/emphysema_01.png",
        riskLevel: RiskLevel.MODERATE
    },
    {
        case_id: 21,
        xray_type: "Abdominal",
        specialization: "General Medicine",
        disease: "Bowel Obstruction",
        description: "Dilated loops of bowel with air-fluid levels.",
        image_path: "dataset/general/obstruction_01.png",
        riskLevel: RiskLevel.HIGH
    },
    {
        case_id: 22,
        xray_type: "Chest",
        specialization: "General Medicine",
        disease: "Aortic Calcification",
        description: "High-density calcific plaques along the aortic arch.",
        image_path: "dataset/general/aorta_01.png",
        riskLevel: RiskLevel.LOW
    }
];

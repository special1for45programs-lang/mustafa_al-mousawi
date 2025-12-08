import { BriefFormData } from '../../types';

export interface StepProps {
    formData: BriefFormData;
    updateFormData: (data: Partial<BriefFormData>) => void;
}

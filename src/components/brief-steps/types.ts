import { BaseBriefData, LogoDetails, SocialDetails, BriefFormData } from '../../types';

export interface StepProps {
  formData: BriefFormData;
  updateFormData: (data: Partial<BaseBriefData>) => void;
}

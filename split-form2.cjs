const fs = require('fs');
const content = fs.readFileSync('src/components/BriefForm.tsx', 'utf8');

const constantsStart = content.indexOf('// ==========================================');
const componentStart = content.indexOf('const BriefForm: React.FC<BriefFormProps> = ({ selectedPackage, onClearPackage, onUpgradePackage }) => {');

const constantsBlock = content.substring(constantsStart, componentStart);

const returnStart = content.indexOf('return (\r\n    <div className="py-24 bg-brand-black');
let actualReturnStart = returnStart;
if (actualReturnStart === -1) {
  actualReturnStart = content.indexOf('return (\n    <div className="py-24 bg-brand-black');
  if (actualReturnStart === -1) {
    throw new Error('Could not find JSX return');
  }
}

const logicBlock = content.substring(componentStart + 'const BriefForm: React.FC<BriefFormProps> = ({ selectedPackage, onClearPackage, onUpgradePackage }) => {'.length, actualReturnStart).trim();

const hookFileContent = `import React, { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { BriefFormData, SocialDetails, LogoDetails, BaseBriefData, PostItem } from '../types';
import { APPLICATION_CATEGORIES, LOGO_TYPE_EXAMPLES } from '../constants';
import { DESIGN_STYLES } from '../utils/designConstants';
import { SelectedPackage } from '../App';
import { addBriefRequest, updateBriefImages } from '../lib/firestore';
import { BriefFormDataSchema } from '../utils/validation';

${constantsBlock}

export const useBriefForm = (selectedPackage: SelectedPackage | null) => {
  ${logicBlock}

  return {
    step,
    setStep,
    isSubmitting,
    isSuccess,
    formData,
    isGeneratingPdf,
    isPdfDownloaded,
    botTrap,
    setBotTrap,
    formRef,
    isSocial,
    STEPS,
    scrollFormToTop,
    updateFormData,
    updateLogoData,
    updateSocialData,
    removeUploadedFile,
    resetForm,
    validateStep,
    downloadPDF,
    handleSubmit
  };
};
`;

fs.writeFileSync('src/hooks/useBriefForm.ts', hookFileContent);

const importsPart = content.substring(0, constantsStart);
const jsxPart = content.substring(actualReturnStart);

const newBriefFormContent = `${importsPart}
import { useBriefForm } from '../hooks/useBriefForm';

const BriefForm: React.FC<BriefFormProps> = ({ selectedPackage, onClearPackage, onUpgradePackage }) => {
  const {
    step,
    setStep,
    isSubmitting,
    isSuccess,
    formData,
    isGeneratingPdf,
    botTrap,
    setBotTrap,
    formRef,
    isSocial,
    STEPS,
    scrollFormToTop,
    updateFormData,
    updateLogoData,
    updateSocialData,
    removeUploadedFile,
    resetForm,
    downloadPDF,
    handleSubmit
  } = useBriefForm(selectedPackage);

  ${jsxPart}
`;

fs.writeFileSync('src/components/BriefForm.tsx', newBriefFormContent);
console.log('Split successful');

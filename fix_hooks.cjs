const fs = require('fs');
let content = fs.readFileSync('src/hooks/useBriefForm.tsx', 'utf8');

if (!content.includes('useCallback')) {
  content = content.replace(/import\s*\{(.*?)\}\s*from\s*'react';/g, (match, imports) => {
    if (!imports.includes('useCallback')) {
      return `import { ${imports}, useCallback } from 'react';`;
    }
    return match;
  });
}

const replacements = [
  {
    regex: /const updateFormData = \(data: Partial<BaseBriefData>\) => \{\s*setFormData\(prev => \(\{ \.\.\.prev, \.\.\.data \}\)\);\s*\};/g,
    replacement: "const updateFormData = useCallback((data: Partial<BaseBriefData>) => {\n    setFormData(prev => ({ ...prev, ...data }));\n  }, []);"
  },
  {
    regex: /const updateLogoData = \(data: Partial<LogoDetails>\) => \{\s*setFormData\(prev => \(\{\s*\.\.\.prev,\s*logoDetails: \{ \.\.\.prev\.logoDetails, \.\.\.data \},\s*\}\)\);\s*\};/g,
    replacement: "const updateLogoData = useCallback((data: Partial<LogoDetails>) => {\n    setFormData(prev => ({\n      ...prev,\n      logoDetails: { ...prev.logoDetails, ...data },\n    }));\n  }, []);"
  },
  {
    regex: /const updateSocialData = \(data: Partial<SocialDetails>\) => \{\s*setFormData\(prev => \(\{\s*\.\.\.prev,\s*socialDetails: \{ \.\.\.prev\.socialDetails, \.\.\.data \},\s*\}\)\);\s*\};/g,
    replacement: "const updateSocialData = useCallback((data: Partial<SocialDetails>) => {\n    setFormData(prev => ({\n      ...prev,\n      socialDetails: { ...prev.socialDetails, ...data },\n    }));\n  }, []);"
  },
  {
    regex: /const removeUploadedFile = \(e: React\.MouseEvent, index: number, isSocialPath: boolean = false\) => \{\s*e\.stopPropagation\(\);\s*if \(\!isSocialPath\) \{\s*setFormData\(prev => \(\{ \s*\.\.\.prev, \s*logoDetails: \{\s*\.\.\.prev\.logoDetails,\s*moodboard: prev\.logoDetails\.moodboard\.filter\(\(_, i\) => i \!\=\= index\)\s*\}\s*\}\)\);\s*\}\s*\};/g,
    replacement: "const removeUploadedFile = useCallback((e: React.MouseEvent, index: number, isSocialPath: boolean = false) => {\n    e.stopPropagation();\n    if (!isSocialPath) {\n      setFormData(prev => ({ \n        ...prev, \n        logoDetails: {\n          ...prev.logoDetails,\n          moodboard: prev.logoDetails.moodboard.filter((_, i) => i !== index)\n        }\n      }));\n    }\n  }, []);"
  },
  {
    regex: /const resetForm = \(\) => \{\s*setFormData\(getInitialFormData\(\)\);\s*setStep\(1\);\s*setIsSuccess\(false\);\s*setIsSubmitting\(false\);\s*setIsPdfDownloaded\(false\);\s*\};/g,
    replacement: "const resetForm = useCallback(() => {\n    setFormData(getInitialFormData());\n    setStep(1);\n    setIsSuccess(false);\n    setIsSubmitting(false);\n    setIsPdfDownloaded(false);\n  }, []);"
  }
];

replacements.forEach(({regex, replacement}) => {
  content = content.replace(regex, replacement);
});

fs.writeFileSync('src/hooks/useBriefForm.tsx', content);

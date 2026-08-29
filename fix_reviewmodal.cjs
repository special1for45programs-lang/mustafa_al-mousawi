const fs = require('fs');
let content = fs.readFileSync('src/components/ReviewModal.tsx', 'utf8');

content = content.replace(
  "const [isSubmitting, setIsSubmitting] = useState(false);",
  "const [isSubmitting, setIsSubmitting] = useState(false);\n  const [inputClientName, setInputClientName] = useState(clientName || '');"
);

content = content.replace(
  /clientName,\n\s*rating,/g,
  "clientName: inputClientName,\n        rating,"
);

const newField = `
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              الاسم أو اسم المشروع (اختياري)
            </label>
            <input
              type="text"
              value={inputClientName}
              onChange={(e) => setInputClientName(e.target.value)}
              disabled={isSubmitting}
              className="form-input-clean"
              placeholder="مثال: متجر عطور..."
            />
          </div>
`;

content = content.replace(
  '<form onSubmit={handleSubmit} className="space-y-6">',
  '<form onSubmit={handleSubmit} className="space-y-6">' + newField
);

content = content.replace(
  'مرحباً {clientName}، رأيك يهمنا جداً لتطوير خدماتنا',
  'رأيك يهمنا جداً لتطوير خدماتنا'
);

fs.writeFileSync('src/components/ReviewModal.tsx', content);

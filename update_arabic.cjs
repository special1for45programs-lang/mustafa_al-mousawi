const fs = require('fs');

let content = fs.readFileSync('src/admin/components/AdminReviews.tsx', 'utf8');

content = content.replace("toast.error('O-O_O' OO OOU+OO OU,O\"O-O. O U,OU,USUSU.OO');", "toast.error('حدث خطأ أثناء جلب التقييمات');");
content = content.replace("toast.success(currentStatus ? 'OU. OOU?OO O U,OU,USUSU.' : 'OU. OOUOO1 O U,OU,USUSU.');", "toast.success(currentStatus ? 'تم إخفاء التقييم' : 'تم إظهار التقييم');");
content = content.replace("toast.error('O-O_O' OO OOU+OO OO-O_USO O-OU,O O U,OU,USUSU.');", "toast.error('حدث خطأ أثناء تحديث حالة التقييم');");
content = content.replace("if (!window.confirm('UU, OU+O U.OOU,O_ U.U+ O-OU? UOO O U,OU,USUSU. OOU,USOO')) return;", "if (!window.confirm('هل أنت متأكد من حذف هذا التقييم نهائياً؟')) return;");
content = content.replace("toast.success('OU. O-OU? O U,OU,USUSU. O\"U+OO O-.');", "toast.success('تم حذف التقييم بنجاح');");
content = content.replace("toast.error('O-O_O' OO OOU+OO O-OU? O U,OU,USUSU.');", "toast.error('حدث خطأ أثناء حذف التقييم');");
content = content.replace("<h1 className=\"text-2xl font-bold text-white mb-2\">OO_OO1O O U,OU,USUSU.OO</h1>", "<h1 className=\"text-2xl font-bold text-white mb-2\">إدارة التقييمات</h1>");
content = content.replace("<p className=\"text-gray-400\">OO-U,U% U?US OOUOO1 U^OO-U?OO OOOO O U,OU.U,OO</p>", "<p className=\"text-gray-400\">تحكم في إظهار وإخفاء آراء العملاء</p>");
content = content.replace("<p className=\"text-gray-400\">U,O OU^OO_ OU,USUSU.OO O-OU,USOO.</p>", "<p className=\"text-gray-400\">لا توجد تقييمات حالياً.</p>");
content = content.replace("<h3 className=\"text-lg font-bold text-white\">{review.clientName || 'OU.USU, U.U.USO1'}</h3>", "<h3 className=\"text-lg font-bold text-white\">{review.clientName || 'عميل مميز'}</h3>");
content = content.replace("title={review.isVisible ? \"OOU?OO O U,OU,USUSU.\" : \"OOUOO1 O U,OU,USUSU.\"}", "title={review.isVisible ? \"إخفاء التقييم\" : \"إظهار التقييم\"}");
content = content.replace("title=\"O-OU? O U,OU,USUSU.\"", "title=\"حذف التقييم\"");
content = content.replace("{review.comment || 'U,O OU^OO_ OOU,USO, U+OUS.'}", "{review.comment || 'لا يوجد تعليق نصي.'}");
content = content.replace("? review.createdAt.toDate().toLocaleDateString('ar-SA') : 'OOOUSO OUSO1 U.OO1U^O?'}", "? review.createdAt.toDate().toLocaleDateString('ar-SA') : 'تاريخ غير معروف'}");
content = content.replace("{review.isVisible ? 'U.O1OUS' : 'U.OU?US'}", "{review.isVisible ? 'مرئي' : 'مخفي'}");

fs.writeFileSync('src/admin/components/AdminReviews.tsx', content, 'utf8');

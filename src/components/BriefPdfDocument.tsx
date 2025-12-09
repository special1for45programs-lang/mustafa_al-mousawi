import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Link
} from '@react-pdf/renderer';
import { BriefFormData } from '../types';
import { APPLICATION_OPTIONS } from '../constants';

// Note: Using default Helvetica font which is bundled with @react-pdf/renderer
// Custom Arabic fonts can be added later if needed

// تعريف الأنماط
const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
        fontSize: 11,
        direction: 'rtl'
    },

    // Header Styles
    header: {
        backgroundColor: '#000000',
        height: 120,
        borderBottom: '2px solid #d4ff00',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 40,
        direction: 'ltr'
    },
    logo: {
        width: 60,
        height: 60,
        marginRight: 20
    },
    headerTextContainer: {
        flexDirection: 'column'
    },
    headerTitle: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 32,
        color: '#ffffff',
        letterSpacing: 2,
        textTransform: 'uppercase'
    },
    headerSubtitle: {
        color: '#ffffff',
        fontSize: 10,
        letterSpacing: 1.5,
        opacity: 0.9,
        marginTop: 4
    },

    // Content Container
    content: {
        padding: 40,
        flexGrow: 1
    },

    // Section Styles
    section: {
        marginBottom: 20,
        paddingBottom: 15,
        borderBottom: '1px solid #f3f4f6'
    },
    lastSection: {
        marginBottom: 20,
        paddingBottom: 15
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 8
    },
    sectionIndicator: {
        width: 4,
        height: 20,
        backgroundColor: '#d4ff00',
        borderRadius: 10
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: '#111827'
    },

    // Grid Styles
    grid: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 15
    },
    gridItem: {
        flex: 1
    },
    fullWidth: {
        width: '100%'
    },

    // Field Styles
    fieldLabel: {
        fontSize: 9,
        fontWeight: 700,
        color: '#9ca3af',
        marginBottom: 5
    },
    fieldValue: {
        fontWeight: 700,
        color: '#000000',
        backgroundColor: '#f9fafb',
        padding: 10,
        borderRadius: 8,
        border: '1px solid #e5e7eb'
    },
    fieldValueLarge: {
        fontWeight: 700,
        color: '#000000',
        fontSize: 14,
        backgroundColor: '#f9fafb',
        padding: 12,
        borderRadius: 10,
        border: '1px solid #e5e7eb'
    },
    fieldValueMultiline: {
        fontWeight: 500,
        color: '#374151',
        lineHeight: 1.6,
        backgroundColor: '#f9fafb',
        padding: 12,
        borderRadius: 10,
        border: '1px solid #e5e7eb',
        minHeight: 60
    },
    fieldValueBudget: {
        fontWeight: 700,
        color: '#000000',
        backgroundColor: 'rgba(212, 255, 0, 0.1)',
        border: '1px solid #d4ff00',
        padding: 10,
        borderRadius: 8,
        textAlign: 'center'
    },
    ltr: {
        direction: 'ltr'
    },

    // Tags/Chips Styles
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        backgroundColor: '#f9fafb',
        padding: 12,
        borderRadius: 10,
        border: '1px solid #e5e7eb'
    },
    tag: {
        backgroundColor: '#ffffff',
        border: '1px solid #d1d5db',
        color: '#374151',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        fontSize: 9,
        fontWeight: 700
    },
    emptyTag: {
        color: '#9ca3af',
        fontStyle: 'italic',
        fontSize: 9
    },

    // Notes Section
    notesContainer: {
        backgroundColor: '#fef3c7',
        border: '1px solid #fde68a',
        borderRadius: 10,
        padding: 15,
        color: '#78350f',
        fontSize: 9,
        fontWeight: 700,
        lineHeight: 1.6
    },

    // Images Grid
    imagesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    imageContainer: {
        width: '30%',
        borderRadius: 10,
        border: '1px solid #d1d5db',
        backgroundColor: '#f9fafb',
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: 'auto',
        objectFit: 'contain'
    },

    // Footer Styles
    footer: {
        backgroundColor: '#000000',
        paddingVertical: 20,
        paddingHorizontal: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        direction: 'ltr',
        position: 'relative'
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    instagramIcon: {
        width: 25,
        height: 25,
        backgroundColor: 'rgba(212, 255, 0, 0.2)',
        borderRadius: 6,
        border: '1px solid rgba(212, 255, 0, 0.3)',
        padding: 4
    },
    instagramText: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 11,
        color: '#d4ff00',
        letterSpacing: 1
    },
    pageNumber: {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 30,
        height: 30,
        backgroundColor: '#d4ff00',
        borderRadius: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pageNumberText: {
        color: '#000000',
        fontWeight: 700,
        fontSize: 12
    }
});

interface BriefPdfDocumentProps {
    formData: BriefFormData;
}

const BriefPdfDocument: React.FC<BriefPdfDocumentProps> = ({ formData }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.header} fixed>
                    <Image
                        src="https://mustafa-kappa.vercel.app/Images/logoS1.png"
                        style={styles.logo}
                    />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>MUSTAFA</Text>
                        <Text style={styles.headerSubtitle}>Ali Moossawi</Text>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>

                    {/* 1. Client Info */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIndicator} />
                            <Text style={styles.sectionTitle}>معلومات العميل</Text>
                        </View>
                        <View style={styles.grid}>
                            <View style={styles.gridItem}>
                                <Text style={styles.fieldLabel}>اسم العميل</Text>
                                <Text style={styles.fieldValue}>{formData.clientName}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={styles.fieldLabel}>اسم الشركة</Text>
                                <Text style={styles.fieldValue}>{formData.companyName}</Text>
                            </View>
                        </View>
                        <View style={styles.grid}>
                            <View style={styles.gridItem}>
                                <Text style={styles.fieldLabel}>رقم الهاتف</Text>
                                <Text style={[styles.fieldValue, styles.ltr]}>{formData.phone}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={styles.fieldLabel}>البريد الإلكتروني</Text>
                                <Text style={[styles.fieldValue, styles.ltr]}>{formData.email}</Text>
                            </View>
                        </View>
                    </View>

                    {/* 2. Project Details */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIndicator} />
                            <Text style={styles.sectionTitle}>تفاصيل المشروع</Text>
                        </View>
                        <View style={[styles.fullWidth, { marginBottom: 15 }]}>
                            <Text style={styles.fieldLabel}>اسم المشروع</Text>
                            <Text style={styles.fieldValueLarge}>{formData.projectName}</Text>
                        </View>
                        <View style={[styles.fullWidth, { marginBottom: 15 }]}>
                            <Text style={styles.fieldLabel}>نبذة عن المشروع</Text>
                            <Text style={styles.fieldValueMultiline}>{formData.projectDescription}</Text>
                        </View>
                        <View style={styles.grid}>
                            <View style={styles.gridItem}>
                                <Text style={styles.fieldLabel}>المجال</Text>
                                <Text style={styles.fieldValue}>{formData.projectType || '-'}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={styles.fieldLabel}>الألوان المفضلة</Text>
                                <Text style={styles.fieldValue}>{formData.favoriteColors || '-'}</Text>
                            </View>
                        </View>
                    </View>

                    {/* 3. Specs & Timeline */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIndicator} />
                            <Text style={styles.sectionTitle}>المواصفات والجدول</Text>
                        </View>
                        <View style={styles.grid}>
                            <View style={styles.gridItem}>
                                <Text style={styles.fieldLabel}>نوع الشعار</Text>
                                <Text style={styles.fieldValue}>{formData.logoType}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={styles.fieldLabel}>الميزانية</Text>
                                <Text style={styles.fieldValueBudget}>{formData.budget}$</Text>
                            </View>
                        </View>
                        <View style={[styles.fullWidth, { marginBottom: 15, marginTop: 15 }]}>
                            <Text style={styles.fieldLabel}>التطبيقات المطلوبة</Text>
                            <View style={styles.tagsContainer}>
                                {Object.entries(formData.applications).filter(([_, v]) => v).map(([k, _]) => {
                                    const app = APPLICATION_OPTIONS.find(a => a.key === k);
                                    return (
                                        <Text key={k} style={styles.tag}>
                                            {app ? app.label.split('(')[0].trim() : k}
                                        </Text>
                                    );
                                })}
                                {formData.otherApplication && (
                                    <Text style={styles.tag}>{formData.otherApplication}</Text>
                                )}
                                {Object.values(formData.applications).every(v => !v) && !formData.otherApplication && (
                                    <Text style={styles.emptyTag}>لم يتم اختيار تطبيقات</Text>
                                )}
                            </View>
                        </View>
                        <View style={styles.grid}>
                            <View style={styles.gridItem}>
                                <Text style={styles.fieldLabel}>تاريخ البدء</Text>
                                <Text style={styles.fieldValue}>{formData.startDate || '-'}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={styles.fieldLabel}>تاريخ التسليم</Text>
                                <Text style={styles.fieldValue}>{formData.deadline || '-'}</Text>
                            </View>
                        </View>
                    </View>

                    {/* 4. Attachments */}
                    {formData.moodboard && formData.moodboard.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionIndicator} />
                                <Text style={styles.sectionTitle}>المرفقات ({formData.moodboard.length})</Text>
                            </View>
                            <View style={styles.imagesGrid}>
                                {formData.moodboard.map((img, index) => (
                                    <View key={index} style={styles.imageContainer}>
                                        <Image src={img} style={styles.image} />
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* 5. Notes */}
                    {formData.notes && (
                        <View style={styles.lastSection}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionIndicator} />
                                <Text style={styles.sectionTitle}>ملاحظات إضافية</Text>
                            </View>
                            <Text style={styles.notesContainer}>{formData.notes}</Text>
                        </View>
                    )}

                </View>

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <View style={styles.footerLeft}>
                        <View style={styles.instagramIcon} />
                        <Text style={styles.instagramText}>mustafa.al_moossawi</Text>
                    </View>
                    <View style={styles.pageNumber}>
                        <Text style={styles.pageNumberText} render={({ pageNumber }) => `${pageNumber}`} />
                    </View>
                </View>

            </Page>
        </Document>
    );
};

export default BriefPdfDocument;

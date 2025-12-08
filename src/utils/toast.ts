import toast, { Toaster } from 'react-hot-toast';

// Toast notification styles matching brand colors
export const showToast = {
    success: (message: string) => {
        toast.success(message, {
            style: {
                background: '#0A0A0A',
                color: '#CCFF00',
                border: '1px solid #CCFF00',
                borderRadius: '12px',
                padding: '16px',
                fontWeight: '600',
            },
            iconTheme: {
                primary: '#CCFF00',
                secondary: '#0A0A0A',
            },
            duration: 4000,
        });
    },

    error: (message: string) => {
        toast.error(message, {
            style: {
                background: '#0A0A0A',
                color: '#FF4444',
                border: '1px solid #FF4444',
                borderRadius: '12px',
                padding: '16px',
                fontWeight: '600',
            },
            iconTheme: {
                primary: '#FF4444',
                secondary: '#0A0A0A',
            },
            duration: 5000,
        });
    },

    loading: (message: string) => {
        return toast.loading(message, {
            style: {
                background: '#0A0A0A',
                color: '#FFFFFF',
                border: '1px solid #333333',
                borderRadius: '12px',
                padding: '16px',
                fontWeight: '600',
            },
        });
    },

    dismiss: (toastId: string) => {
        toast.dismiss(toastId);
    },
};

// Toaster component to be added to App.tsx
export { Toaster };

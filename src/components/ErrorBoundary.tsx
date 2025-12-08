import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        // Log error to an error reporting service if needed
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
                    <div className="max-w-2xl w-full bg-brand-dark border-2 border-red-500/20 rounded-3xl p-8 md:p-12 text-center">
                        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-500">
                            <AlertTriangle size={48} className="text-red-500" />
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            عذراً، حدث خطأ غير متوقع
                        </h1>

                        <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                            نعتذر عن هذا الإزعاج. حدث خطأ أثناء تحميل الصفحة.
                            يرجى المحاولة مرة أخرى أو الاتصال بنا إذا استمرت المشكلة.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-8 text-left bg-brand-black/50 rounded-xl p-6 border border-gray-800">
                                <summary className="cursor-pointer font-bold text-red-400 mb-4">
                                    تفاصيل الخطأ (وضع التطوير فقط)
                                </summary>
                                <pre className="text-xs text-gray-500 overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={this.handleReset}
                                className="bg-brand-lime text-black hover:bg-lime-400 px-8 py-4 text-lg"
                            >
                                <RefreshCw size={20} className="ml-2" />
                                العودة للصفحة الرئيسية
                            </Button>

                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:border-brand-lime hover:text-brand-lime px-8 py-4 text-lg"
                            >
                                إعادة تحميل الصفحة
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

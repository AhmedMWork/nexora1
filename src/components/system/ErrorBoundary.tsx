import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error?.message || 'Unexpected page error',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[NEXORA] Page error recovered by ErrorBoundary:', error, info);
  }

  reset = () => {
    this.setState({ hasError: false, message: '' });
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const isArabic = document.documentElement.lang === 'ar';

    return (
      <main className="min-h-screen bg-[var(--v33-bg)] text-[var(--v33-text)] flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-xl rounded-[28px] border border-[var(--v33-border)] bg-[var(--v33-card)] p-8 text-center shadow-[0_30px_90px_var(--v33-shadow)]">
          <img src="/assets/nexora-logo-dark.png" alt="NEXORA" className="mx-auto mb-6 h-16 w-auto object-contain dark:hidden" />
          <img src="/assets/nexora-logo-ivory.png" alt="NEXORA" className="mx-auto mb-6 hidden h-16 w-auto object-contain dark:block" />
          <p className="v3-kicker mb-3">NEXORA</p>
          <h1 className="text-2xl font-semibold tracking-[-0.04em]">
            {isArabic ? 'حدث خطأ مؤقت' : 'A temporary issue happened'}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--v33-muted)]">
            {isArabic
              ? 'الصفحة لم تُحمّل بشكل صحيح. يمكنك الرجوع للصفحة الرئيسية أو تحديث الموقع بدون أن تظهر صفحة بيضاء.'
              : 'The page did not load correctly. You can return home or refresh without getting a blank screen.'}
          </p>
          {this.state.message && (
            <p className="mt-4 rounded-2xl border border-[var(--v33-border)] bg-[var(--v33-elevated,var(--v33-bg-soft))] px-4 py-3 text-xs text-[var(--v33-muted)]">
              {this.state.message}
            </p>
          )}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button onClick={this.reset} className="nexora-button-primary">
              {isArabic ? 'العودة للرئيسية' : 'Back Home'}
            </button>
            <Link to="/shop" className="nexora-button">
              {isArabic ? 'فتح المتجر' : 'Open Shop'}
            </Link>
          </div>
        </div>
      </main>
    );
  }
}

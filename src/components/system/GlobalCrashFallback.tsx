export default function GlobalCrashFallback() {
  const isArabic = document.documentElement.lang === 'ar';
  return (
    <main className="min-h-screen bg-[#0F1115] px-5 py-16 text-[#F5F1EA] flex items-center justify-center">
      <section className="w-full max-w-lg rounded-[28px] border border-[#2E3442] bg-[#171A21] p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,.35)]">
        <img src="/assets/nexora-logo-ivory.png" alt="NEXORA" className="mx-auto mb-6 h-16 w-auto object-contain" />
        <p className="mb-3 text-[10px] tracking-[0.28em] text-[#D7B98E]">NEXORA</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em]">{isArabic ? 'حدث خطأ مؤقت' : 'Temporary loading issue'}</h1>
        <p className="mt-4 text-sm leading-7 text-[#A7AEBB]">
          {isArabic
            ? 'تم منع الصفحة البيضاء. يمكنك إعادة تحميل الصفحة أو الرجوع للرئيسية.'
            : 'Blank screen was prevented. Reload the page or return home.'}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={() => window.location.reload()} className="nexora-button-primary">{isArabic ? 'إعادة التحميل' : 'Reload'}</button>
          <button onClick={() => { window.location.href = '/'; }} className="nexora-button">{isArabic ? 'الرئيسية' : 'Home'}</button>
        </div>
      </section>
    </main>
  );
}

// ============================================================
// NEXORA — Contact Page
// ============================================================

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { contactSchema, type ContactFormData } from '@/lib/validators';
import { generateWhatsAppLink } from '@/lib/egyptData';
import { createContactMessage } from '@/lib/supabase/db';
import SectionReveal from '@/components/ui/SectionReveal';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [whatsAppNumber, setWhatsAppNumber] = useState('201020304050');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    let mounted = true;
    import('@/lib/supabase/db')
      .then(({ getSiteSettings }) => getSiteSettings())
      .then((settings) => {
        if (mounted && settings?.whatsappNumber) setWhatsAppNumber(settings.whatsappNumber);
      })
      .catch(() => undefined);
    return () => { mounted = false; };
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    try {
      await createContactMessage(data);
      toast.success('Message sent! We will get back to you soon.');
      reset();
    } catch {
      toast.error('Message could not be sent. Please try WhatsApp.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact | NEXORA</title>
        <meta name="description" content="Get in touch with NEXORA. We are here to help with orders, sizing, or any questions." />
      </Helmet>

      <div className="pt-24 pb-20 bg-[#050505] min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <SectionReveal>
            <p className="nexora-caption text-[#c8a96a] mb-3">Get In Touch</p>
            <h1 className="nexora-heading-md mb-8">CONTACT US</h1>
          </SectionReveal>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-4">
              {[
                { icon: Phone, label: 'WhatsApp', value: whatsAppNumber.startsWith('20') ? `+${whatsAppNumber}` : `+2${whatsAppNumber}`, href: generateWhatsAppLink(whatsAppNumber, 'Hello NEXORA!') },
                { icon: Mail, label: 'Email', value: 'support@nexora.store', href: 'mailto:support@nexora.store' },
                { icon: MapPin, label: 'Location', value: 'Cairo, Egypt' },
                { icon: Clock, label: 'Working Hours', value: 'Sun - Thu, 10AM - 6PM' },
              ].map((item) => (
                <SectionReveal key={item.label}>
                  <div className="p-5 bg-[#0b0b0d] border border-[#17171a]">
                    <div className="flex items-center gap-3 mb-2">
                      <item.icon className="w-4 h-4 text-[#c8a96a]" />
                      <span className="text-[10px] tracking-[0.2em] uppercase text-[#b8b0a3]">{item.label}</span>
                    </div>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[#f4f0e8] hover:text-[#c8a96a] transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-[#f4f0e8]">{item.value}</p>
                    )}
                  </div>
                </SectionReveal>
              ))}

              {/* WhatsApp CTA */}
              <SectionReveal delay={0.3}>
                <a
                  href={generateWhatsAppLink(whatsAppNumber, 'Hello NEXORA! I have a question about my order.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold tracking-wider uppercase hover:bg-green-500/20 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </SectionReveal>
            </div>

            {/* Contact Form */}
            <SectionReveal delay={0.2} className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-[#0b0b0d] border border-[#17171a]">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#f4f0e8] mb-6">Send a Message</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">Name *</label>
                    <input
                      {...register('name')}
                      className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] placeholder:text-[#2a2a2d] focus:outline-none focus:border-[#c8a96a] transition-colors"
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">Email *</label>
                    <input
                      {...register('email')}
                      className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] placeholder:text-[#2a2a2d] focus:outline-none focus:border-[#c8a96a] transition-colors"
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">Subject *</label>
                  <input
                    {...register('subject')}
                    className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] placeholder:text-[#2a2a2d] focus:outline-none focus:border-[#c8a96a] transition-colors"
                    placeholder="How can we help?"
                  />
                  {errors.subject && <p className="text-[10px] text-red-400 mt-1">{errors.subject.message}</p>}
                </div>
                <div className="mb-6">
                  <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">Message *</label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] placeholder:text-[#2a2a2d] focus:outline-none focus:border-[#c8a96a] transition-colors resize-none"
                    placeholder="Tell us more..."
                  />
                  {errors.message && <p className="text-[10px] text-red-400 mt-1">{errors.message.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="nexora-button-primary flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </SectionReveal>
          </div>
        </div>
      </div>
    </>
  );
}

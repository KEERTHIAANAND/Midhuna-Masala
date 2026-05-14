'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, Send, MessageCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { clientEnv } from '@/lib/env';

const CONTACT_INFO = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: 'Email Us',
    value: 'midhunamasala1977@gmail.com',
    href: 'mailto:midhunamasala1977@gmail.com',
    description: 'We respond within 24 hours',
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: 'Visit Us',
    value: 'Kavindapadi, Tamil Nadu',
    href: '#',
    description: 'Erode District, India',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    label: 'Working Hours',
    value: 'Mon – Sat: 9 AM – 6 PM',
    href: '#',
    description: 'Sunday & Holidays: Closed',
  },
];

const FAQ_ITEMS = [
  {
    question: 'How long does delivery take?',
    answer:
      'Standard delivery within Tamil Nadu takes 2–4 business days. For the rest of India, delivery typically takes 5–7 business days. Express shipping options are also available at checkout.',
  },
  {
    question: 'Are your spices 100% natural?',
    answer:
      'Yes! All Midhuna Masala products are made from hand-selected, premium-quality ingredients. Our spices are stone-ground, sun-dried, and contain absolutely no artificial colours, flavours, or preservatives.',
  },
  {
    question: 'Can I return or exchange a product?',
    answer:
      'Due to the consumable nature of our products, returns are accepted only for damaged, defective, or incorrect items. Please report any issues within 48 hours of delivery with photographs. Read our full Cancellation & Refund Policy for details.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Currently, we ship only within India. We are working on expanding to international markets. For specific international inquiries, please email us at midhunamasala1977@gmail.com.',
  },
  {
    question: 'How do I track my order?',
    answer:
      'Once your order is dispatched, you will receive a tracking number via email and SMS. You can also visit our Track Order page and enter your order number to get real-time updates.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards, UPI (Google Pay, PhonePe, Paytm), net banking, and select digital wallets. All payments are processed through secure, PCI-DSS compliant payment gateways.',
  },
];

export default function ContactContent() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${clientEnv.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        alert(data.error || 'Failed to send message. Please try again later.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-[#8B1E1E] overflow-hidden">
        {/* Dotted background pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#F6C84C 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        {/* Diagonal accent */}
        <div className="absolute top-0 right-0 w-80 h-80 opacity-10 pointer-events-none">
          <svg viewBox="0 0 320 320" fill="none">
            <path d="M0 320L320 0" stroke="#F6C84C" strokeWidth="1" />
            <path d="M40 320L320 40" stroke="#F6C84C" strokeWidth="0.5" />
            <path d="M80 320L320 80" stroke="#F6C84C" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex justify-center mb-5"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#F6C84C]/40 flex items-center justify-center text-[#F6C84C]">
              <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-serif tracking-wide mb-3"
          >
            Contact Us
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm sm:text-base text-[#F6C84C]/80 font-serif italic max-w-md mx-auto"
          >
            We&apos;d love to hear from you — whether it&apos;s about our spices, your order, or just to say hello
          </motion.p>
        </div>

        {/* Bottom wave separator */}
        <div className="absolute -bottom-px left-0 right-0">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="block w-full h-6 sm:h-8 md:h-10">
            <path d="M0 40V20C240 0 480 0 720 20C960 40 1200 40 1440 20V40H0Z" fill="#FFFDF5" />
          </svg>
        </div>
      </section>



      {/* Contact Info Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CONTACT_INFO.map((info, idx) => (
            <motion.a
              key={info.label}
              href={info.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-[#F5E9DB]/60 shadow-[0_2px_20px_rgba(139,30,30,0.04)] hover:shadow-[0_8px_40px_rgba(139,30,30,0.08)] hover:border-[#8B1E1E]/15 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-[#8B1E1E]/5 border border-[#8B1E1E]/10 flex items-center justify-center text-[#8B1E1E] group-hover:bg-[#8B1E1E] group-hover:text-white transition-all duration-300 mb-4">
                {info.icon}
              </div>
              <p className="text-xs font-bold text-[#8B1E1E]/40 tracking-widest uppercase mb-1">
                {info.label}
              </p>
              <p className="text-sm font-semibold text-[#8B1E1E] mb-1">{info.value}</p>
              <p className="text-xs text-[#4A3728]/50">{info.description}</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Contact Form + Map Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3 bg-white rounded-2xl shadow-[0_4px_40px_rgba(139,30,30,0.06)] border border-[#F5E9DB]/60 overflow-hidden"
          >
            <div className="h-1 bg-gradient-to-r from-[#8B1E1E] via-[#D4AF37] to-[#8B1E1E]" />
            <div className="p-6 sm:p-8 md:p-10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#8B1E1E] font-serif mb-1">
                Send us a Message
              </h2>
              <p className="text-sm text-[#4A3728]/60 mb-6">
                Fill in the form below and we&apos;ll get back to you within 24 hours
              </p>

              {submitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-[#8B1E1E] font-serif mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-[#4A3728]/60 mb-4">
                    Thank you for reaching out. We&apos;ll respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm text-[#8B1E1E] underline underline-offset-2 hover:text-[#D4AF37] transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-bold text-[#8B1E1E]/60 tracking-wider uppercase mb-1.5">
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#F5E9DB] bg-[#FFFDF5] text-sm text-[#4A3728] focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/20 focus:border-[#8B1E1E]/30 transition-all placeholder:text-[#4A3728]/30"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-bold text-[#8B1E1E]/60 tracking-wider uppercase mb-1.5">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#F5E9DB] bg-[#FFFDF5] text-sm text-[#4A3728] focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/20 focus:border-[#8B1E1E]/30 transition-all placeholder:text-[#4A3728]/30"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-bold text-[#8B1E1E]/60 tracking-wider uppercase mb-1.5">
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#F5E9DB] bg-[#FFFDF5] text-sm text-[#4A3728] focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/20 focus:border-[#8B1E1E]/30 transition-all placeholder:text-[#4A3728]/30"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="block text-xs font-bold text-[#8B1E1E]/60 tracking-wider uppercase mb-1.5">
                        Subject *
                      </label>
                      <select
                        id="contact-subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#F5E9DB] bg-[#FFFDF5] text-sm text-[#4A3728] focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/20 focus:border-[#8B1E1E]/30 transition-all"
                      >
                        <option value="">Select a subject</option>
                        <option value="order">Order Related Query</option>
                        <option value="product">Product Inquiry</option>
                        <option value="shipping">Shipping & Delivery</option>
                        <option value="refund">Refund & Returns</option>
                        <option value="bulk">Bulk / Wholesale Orders</option>
                        <option value="feedback">Feedback & Suggestions</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold text-[#8B1E1E]/60 tracking-wider uppercase mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#F5E9DB] bg-[#FFFDF5] text-sm text-[#4A3728] focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/20 focus:border-[#8B1E1E]/30 transition-all resize-none placeholder:text-[#4A3728]/30"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#8B1E1E] text-white text-sm font-bold tracking-[0.15em] uppercase rounded-lg hover:bg-[#6B1616] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Map + Business Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Map embed */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_40px_rgba(139,30,30,0.06)] border border-[#F5E9DB]/60">
              <div className="h-1 bg-gradient-to-r from-[#D4AF37] via-[#8B1E1E] to-[#D4AF37]" />
              <div className="aspect-[4/3] bg-[#F5E9DB]/20 relative overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62597.76!2d77.5!3d11.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba93df4f1e1d193%3A0x1e1dbb5f4d6f1e5b!2sKavindapadi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Midhuna Masala - Kavindapadi, Erode District, Tamil Nadu"
                  className="absolute inset-0"
                />
              </div>
            </div>

            {/* Business Details */}
            <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(139,30,30,0.06)] border border-[#F5E9DB]/60 p-5 sm:p-6">
              <h3 className="text-sm font-bold text-[#8B1E1E] font-serif mb-3">Business Details</h3>
              <div className="space-y-2.5 text-sm text-[#4A3728]">
                <div className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#8B1E1E]">Midhuna Masala</p>
                    <p className="text-xs text-[#4A3728]/60">Traditional Stone Ground Spices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />
                  <p>36C Bommanpatti Road 2nd Street, Kavindapadi, Erode District, Tamil Nadu, India</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />
                  <p>FSSAI License: 22421056000146</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white border-t border-[#F5E9DB]/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold text-[#D4AF37] tracking-[0.3em] uppercase mb-2">
              Need Quick Answers?
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#8B1E1E] font-serif">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="border border-[#F5E9DB]/80 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-[#F5E9DB]/10 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-[#8B1E1E] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8B1E1E]/40 flex-shrink-0 transition-transform duration-300 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === idx ? 'auto' : 0,
                    opacity: openFaq === idx ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-[#4A3728]/80 leading-relaxed border-t border-[#F5E9DB]/50 pt-3">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </>
  );
}

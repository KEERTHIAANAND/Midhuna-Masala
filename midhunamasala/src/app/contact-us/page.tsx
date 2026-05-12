import type { Metadata } from 'next';
import Footer from '@/components/layout/Footer';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
  title: 'Contact Us | Midhuna Masala',
  description:
    'Get in touch with Midhuna Masala. We\'re here to help with your queries about our traditional Chettinad spices, orders, and more.',
};

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      <ContactContent />
      <Footer />
    </div>
  );
}

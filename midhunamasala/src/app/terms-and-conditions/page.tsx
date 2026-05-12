import type { Metadata } from 'next';
import PolicyLayout, { PolicySection } from '@/components/layout/PolicyLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Midhuna Masala',
  description:
    'Read the Terms and Conditions for using the Midhuna Masala website and purchasing our traditional stone-ground spices.',
};

const ShieldIcon = () => (
  <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export default function TermsAndConditionsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using our website"
      icon={<ShieldIcon />}
      lastUpdated="12 May 2026"
    >
      <PolicySection number="01" title="Acceptance of Terms">
        <p>
          Welcome to <strong className="text-[#8B1E1E]">Midhuna Masala</strong>. These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the Midhuna Masala website and any related services (collectively, the &ldquo;Platform&rdquo;). By accessing, browsing, or purchasing from our Platform, you acknowledge that you have read, understood, and unconditionally agree to be bound by these Terms, as well as our Privacy Policy. If you do not agree with any part of these Terms, you must not use our Platform.
        </p>
      </PolicySection>

      <PolicySection number="02" title="Eligibility">
        <p>
          By using this Platform, you represent and warrant that you are at least 18 years of age and legally capable of entering into a binding contract under the Indian Contract Act, 1872. Minors may only use the Platform under the direct supervision of a parent or legal guardian who agrees to be bound by these Terms.
        </p>
      </PolicySection>

      <PolicySection number="03" title="Account Registration and Security">
        <p>To access certain features, you may be required to register an account. You agree to:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Provide accurate, current, and complete information during registration.</li>
          <li>Maintain the strict confidentiality of your password and account credentials.</li>
          <li>Accept full responsibility for all activities that occur under your account.</li>
          <li>Notify us immediately at <a href="mailto:midhunamasala1977@gmail.com" className="text-[#8B1E1E] underline underline-offset-2 hover:text-[#D4AF37] transition-colors">midhunamasala1977@gmail.com</a> of any unauthorized use or security breach.</li>
        </ul>
        <p className="mt-3">
          Midhuna Masala reserves the right to terminate accounts, remove or edit content, or cancel orders at our sole discretion if we suspect fraudulent or unauthorized activity.
        </p>
      </PolicySection>

      <PolicySection number="04" title="Food Safety, FSSAI Compliance, and Shelf Life">
        <p>
          As a Food Business Operator (FBO), Midhuna Masala strictly adheres to the regulations set forth by the Food Safety and Standards Authority of India (FSSAI).
        </p>
        <div className="mt-3 space-y-3">
          <div className="p-4 bg-[#8B1E1E]/[0.03] rounded-lg border border-[#8B1E1E]/10">
            <h4 className="text-sm font-bold text-[#8B1E1E] mb-1">License</h4>
            <p>We operate under FSSAI License Number: <strong>22421056000146</strong>.</p>
          </div>
          <div className="p-4 bg-[#8B1E1E]/[0.03] rounded-lg border border-[#8B1E1E]/10">
            <h4 className="text-sm font-bold text-[#8B1E1E] mb-1">Shelf Life Guarantee</h4>
            <p>We ensure that all perishable items and packaged spices delivered to you have a minimum remaining shelf life of 30% or 45 days (whichever is higher) at the time of delivery.</p>
          </div>
          <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-200/50">
            <h4 className="text-sm font-bold text-amber-800 mb-1">⚠ Health and Allergen Disclaimer</h4>
            <p className="text-sm text-amber-900/80">
              While we maintain stringent hygiene standards, our facilities process various spices. Customers are strongly advised to review the ingredient list for potential allergens. Midhuna Masala is not liable for any adverse or allergic reactions resulting from the consumption of our products.
            </p>
          </div>
        </div>
      </PolicySection>

      <PolicySection number="05" title="Products, Pricing, and Accuracy">
        <p>
          We strive to describe and display our products accurately. However, due to the natural, agricultural nature of spices, slight variations in color, texture, and aroma may occur. These variations are normal and do not constitute a product defect.
        </p>
        <p className="mt-2">
          All prices are listed in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST) unless stated otherwise. Prices and product availability are subject to change without prior notice.
        </p>
        <p className="mt-2">
          In the event a product is listed at an incorrect price due to a typographical error, we reserve the right to cancel any orders placed for that product and issue a full refund.
        </p>
      </PolicySection>

      <PolicySection number="06" title="Orders, Payments, and Taxes">
        <p>
          Placing an order constitutes an offer to purchase. We reserve the right to accept, decline, or impose quantity limits on any order. Your order is legally confirmed only upon successful payment and the dispatch of an order confirmation email/SMS.
        </p>
        <p className="mt-2">
          We process payments through secure, encrypted third-party payment gateways. We accept credit/debit cards, net banking, UPI, and authorized digital wallets.
        </p>
        <p className="mt-2">
          We reserve the right to request additional verification or information before accepting any order to prevent fraudulent transactions.
        </p>
      </PolicySection>

      <PolicySection number="07" title="Shipping, Delivery, and Transfer of Risk">
        <p>
          Shipping timelines provided on the Platform are estimates. Midhuna Masala is not liable for delivery delays caused by third-party couriers, weather conditions, or unforeseen logistical challenges.
        </p>
        <p className="mt-2">
          The risk of loss and title for products purchased pass to you upon our delivery of the items to the designated carrier.
        </p>
      </PolicySection>

      <PolicySection number="08" title="Returns, Cancellations, and Refunds">
        <p>
          Due to the consumable nature of our products and strict health and hygiene regulations:
        </p>
        <div className="mt-3 space-y-3">
          <div className="p-4 bg-red-50/40 rounded-lg border border-red-200/40">
            <h4 className="text-sm font-bold text-red-800 mb-1">✗ Opened Products</h4>
            <p className="text-sm text-red-900/70">We do not accept returns or offer refunds for food products once the original packaging has been opened or the tamper-evident seal is broken.</p>
          </div>
          <div className="p-4 bg-green-50/50 rounded-lg border border-green-200/50">
            <h4 className="text-sm font-bold text-green-800 mb-1">✓ Damaged/Defective Goods</h4>
            <p className="text-sm text-green-900/70">If you receive a physically damaged package, an incorrect item, or an expired product, you must notify us within 24 hours of delivery with photographic evidence. Upon verification, we will issue a replacement or a full refund.</p>
          </div>
          <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-200/50">
            <h4 className="text-sm font-bold text-amber-800 mb-1">⚠ Cancellations</h4>
            <p className="text-sm text-amber-900/70">Orders may be canceled for a full refund only if they have not yet been dispatched from our warehouse.</p>
          </div>
        </div>
      </PolicySection>

      <PolicySection number="09" title="Intellectual Property Rights">
        <p>
          All content on the Platform — including but not limited to the Midhuna Masala name, logos, product names, text, graphics, images, packaging designs, and software — is the exclusive property of Midhuna Masala and is protected by Indian and international copyright, trademark, and intellectual property laws. Unauthorized reproduction, modification, distribution, or commercial exploitation is strictly prohibited.
        </p>
      </PolicySection>

      <PolicySection number="10" title="Prohibited User Conduct">
        <p>You agree <strong>NOT</strong> to use the Platform to:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Violate any local, state, national, or international laws.</li>
          <li>Infringe upon the rights of others, including privacy and intellectual property rights.</li>
          <li>Distribute malware, viruses, or any harmful code.</li>
          <li>Scrape, data-mine, or extract data from the Platform using automated means without our explicit written consent.</li>
          <li>Post false, defamatory, obscene, or abusive reviews and content.</li>
        </ul>
      </PolicySection>

      <PolicySection number="11" title="Limitation of Liability">
        <p>
          To the maximum extent permitted by applicable law, Midhuna Masala, its directors, employees, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages (including lost profits or data) arising out of your use of the Platform or products purchased.
        </p>
        <p className="mt-2">
          In no event shall our total aggregate liability exceed the total amount paid by you for the specific product giving rise to the claim.
        </p>
      </PolicySection>

      <PolicySection number="12" title="Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless Midhuna Masala and its affiliates from and against any claims, liabilities, damages, judgments, awards, losses, costs, and expenses (including reasonable legal fees) arising out of or relating to your violation of these Terms or your use of the Platform.
        </p>
      </PolicySection>

      <PolicySection number="13" title="Force Majeure">
        <p>
          Midhuna Masala shall not be held liable for any delay or failure in performance resulting from causes beyond our reasonable control, including but not limited to acts of God, natural disasters, strikes, pandemic lockdowns, supply chain disruptions, or failure of public utilities.
        </p>
      </PolicySection>

      <PolicySection number="14" title="Governing Law and Dispute Resolution">
        <p>
          These Terms shall be governed by and construed in accordance with the laws of India. Any disputes, controversies, or claims arising out of or relating to these Terms, the Platform, or your purchases shall be subject to the exclusive jurisdiction of the competent courts located in <strong>Erode District, Tamil Nadu, India</strong>.
        </p>
      </PolicySection>

      <PolicySection number="15" title="Severability and Waiver">
        <p>
          If any provision of these Terms is deemed unlawful, void, or unenforceable by a court of competent jurisdiction, that provision shall be severed from the Terms without affecting the validity and enforceability of the remaining provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
        </p>
      </PolicySection>

      <PolicySection number="16" title="Grievance Redressal Mechanism">
        <p>
          Midhuna Masala has appointed a Grievance Officer to address customer concerns.
        </p>
        <div className="mt-3 p-4 bg-[#8B1E1E]/[0.03] rounded-lg border border-[#8B1E1E]/10">
          <p><strong className="text-[#8B1E1E]">Name:</strong> KEERTHI AANAND K S</p>
          <p><strong className="text-[#8B1E1E]">Designation:</strong> Grievance Officer</p>
          <p><strong className="text-[#8B1E1E]">Email:</strong> <a href="mailto:keerthiaanand.official@gmail.com" className="text-[#8B1E1E] underline underline-offset-2 hover:text-[#D4AF37] transition-colors">keerthiaanand.official@gmail.com</a></p>
        </div>
        <p className="mt-3 text-xs text-[#4A3728]/60 italic">
          All complaints will be acknowledged within 48 hours, and a resolution will be provided within 30 days of the receipt of the complaint.
        </p>
      </PolicySection>

      <PolicySection number="17" title="Contact Information">
        <p>
          For any general questions, feedback, or inquiries regarding these Terms and Conditions, please contact us:
        </p>
        <div className="mt-3 p-4 bg-[#8B1E1E]/[0.03] rounded-lg border border-[#8B1E1E]/10">
          <p className="font-semibold text-[#8B1E1E] mb-1">Midhuna Masala</p>
          <p>Email: <a href="mailto:midhunamasala1977@gmail.com" className="text-[#8B1E1E] underline underline-offset-2 hover:text-[#D4AF37] transition-colors">midhunamasala1977@gmail.com</a></p>
          <p>Registered Office Address: 36C Bommanpatti Road 2nd Street Kavindapadi, Erode District, Tamil Nadu, India.</p>
        </div>
      </PolicySection>
    </PolicyLayout>
  );
}

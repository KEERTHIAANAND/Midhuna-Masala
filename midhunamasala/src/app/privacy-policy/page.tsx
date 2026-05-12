import type { Metadata } from 'next';
import PolicyLayout, { PolicySection } from '@/components/layout/PolicyLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Midhuna Masala',
  description:
    'Learn how Midhuna Masala collects, uses, and protects your personal information when you use our website and services.',
};

const LockIcon = () => (
  <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <circle cx="12" cy="16" r="1" />
  </svg>
);

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="Your privacy matters to us — here's how we protect it"
      icon={<LockIcon />}
      lastUpdated="12 May 2026"
    >
      {/* Introduction */}
      <div className="mb-10 p-5 sm:p-6 bg-[#F5E9DB]/30 rounded-xl border border-[#F5E9DB]/60">
        <p className="text-sm sm:text-base text-[#4A3728] leading-relaxed">
          <strong className="text-[#8B1E1E]">Midhuna Masala</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to safeguarding the privacy of our customers and website visitors. This Privacy Policy outlines how we collect, use, store, share, and protect your personal information when you visit our website (www.midhunamasala.com), place an order, or interact with us through any digital channel. This policy is compliant with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023 of India.
        </p>
      </div>

      <PolicySection number="01" title="Information We Collect">
        <p>We may collect the following categories of information:</p>
        <div className="mt-3 space-y-4">
          <div>
            <h4 className="font-semibold text-[#8B1E1E] mb-1">a) Personal Information (Provided by You)</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Full name, email address, phone number</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information (processed securely via third-party gateways)</li>
              <li>Account login credentials</li>
              <li>Order history and preferences</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#8B1E1E] mb-1">b) Automatically Collected Information</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>IP address, browser type, operating system</li>
              <li>Device identifiers and screen resolution</li>
              <li>Pages visited, time spent, referral URLs</li>
              <li>Cookie data and session information</li>
              <li>Geographic location (approximate, based on IP)</li>
            </ul>
          </div>
        </div>
      </PolicySection>

      <PolicySection number="02" title="How We Use Your Information">
        <p>We use the information we collect for the following purposes:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li><strong>Order Fulfilment:</strong> To process, ship, and deliver your orders and send order confirmations and updates</li>
          <li><strong>Customer Support:</strong> To respond to your queries, complaints, and requests in a timely manner</li>
          <li><strong>Account Management:</strong> To create and manage your user account, maintain order history, and provide personalised experiences</li>
          <li><strong>Communication:</strong> To send promotional offers, newsletters, and product updates (only with your consent; you may opt out at any time)</li>
          <li><strong>Website Improvement:</strong> To analyse usage patterns, diagnose technical issues, and enhance user experience</li>
          <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
          <li><strong>Fraud Prevention:</strong> To detect, prevent, and address fraudulent or unauthorized activity</li>
        </ul>
      </PolicySection>

      <PolicySection number="03" title="Cookies & Tracking Technologies">
        <p>
          Our website uses cookies and similar technologies to enhance your browsing experience. Cookies are small text files stored on your device that help us:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Remember your preferences and login status</li>
          <li>Understand how you navigate our website</li>
          <li>Provide relevant product recommendations</li>
          <li>Measure the effectiveness of our marketing campaigns</li>
        </ul>
        <p className="mt-3">
          <strong>Types of cookies we use:</strong>
        </p>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { type: 'Essential', desc: 'Required for basic site functionality' },
            { type: 'Analytics', desc: 'Help us understand user behaviour' },
            { type: 'Functional', desc: 'Remember your preferences' },
            { type: 'Marketing', desc: 'Deliver relevant advertisements' },
          ].map((cookie) => (
            <div key={cookie.type} className="p-3 bg-[#F5E9DB]/20 rounded-lg border border-[#F5E9DB]/50">
              <p className="text-xs font-bold text-[#8B1E1E] uppercase tracking-wider">{cookie.type}</p>
              <p className="text-xs text-[#4A3728]/70 mt-0.5">{cookie.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-3">
          You can manage cookie preferences through your browser settings. Disabling certain cookies may affect the functionality of the Platform.
        </p>
      </PolicySection>

      <PolicySection number="04" title="Data Sharing & Third Parties">
        <p>
          We do not sell, rent, or trade your personal information. However, we may share your data with trusted third parties in the following circumstances:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li><strong>Payment Processors:</strong> To securely process your transactions (e.g., Razorpay, PayU, Stripe)</li>
          <li><strong>Shipping Partners:</strong> To fulfil and deliver your orders (e.g., India Post, DTDC, Delhivery)</li>
          <li><strong>Analytics Providers:</strong> To gather aggregated insights about website usage (e.g., Google Analytics)</li>
          <li><strong>Cloud Services:</strong> To securely host and store data on our behalf</li>
          <li><strong>Legal Authorities:</strong> When required by law, court order, or governmental regulation</li>
        </ul>
        <p className="mt-2">
          All third-party partners are bound by confidentiality agreements and are required to use your data solely for the purposes specified.
        </p>
      </PolicySection>

      <PolicySection number="05" title="Data Security">
        <p>
          We implement industry-standard security measures to protect your personal information, including:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>SSL/TLS encryption for all data in transit</li>
          <li>Encrypted storage of sensitive data at rest</li>
          <li>Regular security audits and vulnerability assessments</li>
          <li>Access controls and authentication mechanisms</li>
          <li>Secure, PCI-DSS compliant payment processing</li>
        </ul>
        <p className="mt-2">
          While we strive to protect your information, no method of electronic transmission or storage is 100% secure. We encourage you to use strong passwords and safeguard your login credentials.
        </p>
      </PolicySection>

      <PolicySection number="06" title="Data Retention">
        <p>
          We retain your personal data only for as long as necessary to fulfil the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Specifically:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li><strong>Order Data:</strong> Retained for a minimum of 8 years for tax and legal compliance</li>
          <li><strong>Account Data:</strong> Retained until you request account deletion</li>
          <li><strong>Analytics Data:</strong> Retained in aggregated, anonymized form indefinitely</li>
          <li><strong>Marketing Data:</strong> Retained until you unsubscribe or withdraw consent</li>
        </ul>
      </PolicySection>

      <PolicySection number="07" title="Your Rights">
        <p>
          Under applicable Indian data protection laws, you have the following rights:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you</li>
          <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete data</li>
          <li><strong>Right to Erasure:</strong> Request deletion of your personal data, subject to legal obligations</li>
          <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for marketing communications at any time</li>
          <li><strong>Right to Nominate:</strong> Nominate an individual to exercise your data rights in case of death or incapacity</li>
        </ul>
        <p className="mt-2">
          To exercise any of these rights, please contact us at <a href="mailto:midhunamasala1977@gmail.com" className="text-[#8B1E1E] underline underline-offset-2 hover:text-[#D4AF37] transition-colors">midhunamasala1977@gmail.com</a>. We will respond within 30 days of receiving your request.
        </p>
      </PolicySection>

      <PolicySection number="08" title="Children's Privacy">
        <p>
          Our Platform is not intended for children under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will take immediate steps to delete such information. If you are a parent or guardian and believe your child has provided us with personal data, please contact us immediately.
        </p>
      </PolicySection>

      <PolicySection number="09" title="Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. Any changes will be posted on this page with an updated &ldquo;Last Updated&rdquo; date. We encourage you to review this policy periodically. Your continued use of the Platform after changes are posted constitutes your acceptance of the revised policy.
        </p>
      </PolicySection>

      <PolicySection number="10" title="Grievance Officer">
        <p>
          In accordance with the Information Technology Act, 2000 and the rules made thereunder, the details of the Grievance Officer are as follows:
        </p>
        <div className="mt-3 p-4 bg-[#8B1E1E]/[0.03] rounded-lg border border-[#8B1E1E]/10">
          <p className="font-semibold text-[#8B1E1E] mb-1">Grievance Officer</p>
          <p>Name: KEERTHI AANAND K S, Midhuna Masala</p>
          <p>Email: <a href="mailto:keerthiaanand.official@gmail.com" className="text-[#8B1E1E] underline underline-offset-2 hover:text-[#D4AF37] transition-colors">keerthiaanand.official@gmail.com</a></p>
          <p>Address: Erode District, Tamil Nadu, India</p>
          <p className="mt-2 text-xs text-[#4A3728]/60">
            Complaints will be acknowledged within 24 hours and resolved within 30 days from the date of receipt.
          </p>
        </div>
      </PolicySection>

      <PolicySection number="11" title="Contact Us">
        <p>
          If you have any questions or concerns about this Privacy Policy or our data practices, please reach out to us:
        </p>
        <div className="mt-3 p-4 bg-[#8B1E1E]/[0.03] rounded-lg border border-[#8B1E1E]/10">
          <p className="font-semibold text-[#8B1E1E] mb-1">Midhuna Masala</p>
          <p>Email: <a href="mailto:midhunamasala1977@gmail.com" className="text-[#8B1E1E] underline underline-offset-2 hover:text-[#D4AF37] transition-colors">midhunamasala1977@gmail.com</a></p>
          <p>Address: Erode District, Tamil Nadu, India</p>
        </div>
      </PolicySection>
    </PolicyLayout>
  );
}

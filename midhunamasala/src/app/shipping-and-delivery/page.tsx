import type { Metadata } from 'next';
import PolicyLayout, { PolicySection } from '@/components/layout/PolicyLayout';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Midhuna Masala',
  description:
    'Learn about Midhuna Masala shipping timelines, delivery charges, tracking, and our packaging standards for traditional stone-ground spices.',
};

const TruckIcon = () => (
  <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

export default function ShippingAndDeliveryPage() {
  return (
    <PolicyLayout
      title="Shipping & Delivery Policy"
      subtitle="From our village to your kitchen — safely and swiftly"
      icon={<TruckIcon />}
      lastUpdated="12 May 2026"
    >
      {/* Introduction */}
      <div className="mb-10 p-5 sm:p-6 bg-[#F5E9DB]/30 rounded-xl border border-[#F5E9DB]/60">
        <p className="text-sm sm:text-base text-[#4A3728] leading-relaxed">
          At <strong className="text-[#8B1E1E]">Midhuna Masala</strong>, we are committed to delivering our authentic, hand-crafted Chettinad spices to your doorstep with care and efficiency. Every order is freshly packed, securely sealed, and dispatched promptly to ensure you receive the purest flavours straight from our village. This policy outlines our shipping processes, delivery timelines, and related terms.
        </p>
      </div>

      <PolicySection number="01" title="Shipping Coverage">
        <p>We currently offer shipping services across India. Our coverage includes:</p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 bg-[#8B1E1E]/[0.03] rounded-lg border border-[#8B1E1E]/10">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <h4 className="text-sm font-bold text-[#8B1E1E]">Metro Cities</h4>
            </div>
            <p className="text-xs text-[#4A3728]/70">Chennai, Bangalore, Mumbai, Delhi NCR, Hyderabad, Kolkata, Pune, Ahmedabad</p>
          </div>
          <div className="p-4 bg-[#8B1E1E]/[0.03] rounded-lg border border-[#8B1E1E]/10">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h4 className="text-sm font-bold text-[#8B1E1E]">Tier 2 & 3 Cities</h4>
            </div>
            <p className="text-xs text-[#4A3728]/70">Coimbatore, Madurai, Trichy, Kochi, Vizag, Jaipur, Lucknow, and 500+ cities across India</p>
          </div>
        </div>
        <p className="mt-3">
          Delivery to remote or rural areas may require additional time. If your pincode is not serviceable, our team will contact you with alternative arrangements.
        </p>
      </PolicySection>

      <PolicySection number="02" title="Order Processing Time">
        <p>
          We believe in freshness. Each order is carefully prepared and quality-checked before dispatch:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li><strong>Standard Orders:</strong> Processed and dispatched within 1–2 business days of order confirmation</li>
          <li><strong>Custom / Bulk Orders:</strong> May require 3–5 business days for preparation and dispatch</li>
          <li><strong>Festive / Peak Seasons:</strong> Processing may take an additional 1–2 business days during festive seasons (Pongal, Diwali, Navratri, etc.)</li>
        </ul>
        <p className="mt-2 text-xs text-[#4A3728]/60">
          <em>Note: Orders placed after 3:00 PM IST or on weekends/holidays will be processed on the next business day.</em>
        </p>
      </PolicySection>

      <PolicySection number="03" title="Delivery Timelines">
        <p>Estimated delivery timelines after dispatch:</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#8B1E1E]/5">
                <th className="text-left p-3 font-semibold text-[#8B1E1E] border border-[#F5E9DB]">Location</th>
                <th className="text-left p-3 font-semibold text-[#8B1E1E] border border-[#F5E9DB]">Standard Delivery</th>
                <th className="text-left p-3 font-semibold text-[#8B1E1E] border border-[#F5E9DB]">Express Delivery</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-[#F5E9DB]">Tamil Nadu (within state)</td>
                <td className="p-3 border border-[#F5E9DB]">2–4 business days</td>
                <td className="p-3 border border-[#F5E9DB]">1–2 business days</td>
              </tr>
              <tr className="bg-[#F5E9DB]/15">
                <td className="p-3 border border-[#F5E9DB]">South India (KA, KL, AP, TS)</td>
                <td className="p-3 border border-[#F5E9DB]">3–5 business days</td>
                <td className="p-3 border border-[#F5E9DB]">2–3 business days</td>
              </tr>
              <tr>
                <td className="p-3 border border-[#F5E9DB]">Metro Cities (Rest of India)</td>
                <td className="p-3 border border-[#F5E9DB]">5–7 business days</td>
                <td className="p-3 border border-[#F5E9DB]">3–4 business days</td>
              </tr>
              <tr className="bg-[#F5E9DB]/15">
                <td className="p-3 border border-[#F5E9DB]">North-East & Remote Areas</td>
                <td className="p-3 border border-[#F5E9DB]">7–10 business days</td>
                <td className="p-3 border border-[#F5E9DB]">5–7 business days</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-[#4A3728]/60">
          <em>Delivery timelines are estimates and may vary due to unforeseen circumstances such as weather conditions, logistics delays, or public holidays. These are not guaranteed delivery dates.</em>
        </p>
      </PolicySection>

      <PolicySection number="04" title="Shipping Charges">
        <p>Our shipping charges are calculated based on order value and delivery location:</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#8B1E1E]/5">
                <th className="text-left p-3 font-semibold text-[#8B1E1E] border border-[#F5E9DB]">Order Value</th>
                <th className="text-left p-3 font-semibold text-[#8B1E1E] border border-[#F5E9DB]">Standard Shipping</th>
                <th className="text-left p-3 font-semibold text-[#8B1E1E] border border-[#F5E9DB]">Express Shipping</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-[#F5E9DB]">Below ₹499</td>
                <td className="p-3 border border-[#F5E9DB]">₹49</td>
                <td className="p-3 border border-[#F5E9DB]">₹99</td>
              </tr>
              <tr className="bg-[#F5E9DB]/15">
                <td className="p-3 border border-[#F5E9DB]">₹499 – ₹999</td>
                <td className="p-3 border border-[#F5E9DB]">₹29</td>
                <td className="p-3 border border-[#F5E9DB]">₹69</td>
              </tr>
              <tr>
                <td className="p-3 border border-[#F5E9DB] font-medium">₹999 and above</td>
                <td className="p-3 border border-[#F5E9DB] text-green-700 font-semibold">FREE ✓</td>
                <td className="p-3 border border-[#F5E9DB]">₹49</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          Shipping charges, if applicable, will be clearly displayed at checkout before payment confirmation.
        </p>
      </PolicySection>

      <PolicySection number="05" title="Payment Mode">
        <div className="p-4 bg-[#8B1E1E]/[0.03] rounded-lg border border-[#8B1E1E]/10">
          <p>
            Currently, <strong className="text-[#8B1E1E]">all orders must be prepaid</strong>. We do not offer Cash on Delivery (COD) services.
          </p>
        </div>
      </PolicySection>

      <PolicySection number="06" title="Order Tracking">
        <p>
          Once your order is dispatched, we will send you a shipping confirmation via email and/or SMS containing:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Courier partner name and tracking number</li>
          <li>A direct link to track your shipment in real-time</li>
          <li>Estimated delivery date</li>
        </ul>
        <p className="mt-2">
          You can also track your order anytime by visiting the <a href="/track-order" className="text-[#8B1E1E] underline underline-offset-2 hover:text-[#D4AF37] transition-colors font-medium">Track Order</a> page on our website and entering your order number.
        </p>
      </PolicySection>

      <PolicySection number="07" title="Packaging Standards">
        <p>
          We take special care in packaging our spice products to ensure they reach you in perfect condition:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li><strong>Airtight Sealing:</strong> All spice packets are vacuum-sealed or zip-locked to preserve freshness and aroma</li>
          <li><strong>Tamper-Evident Packaging:</strong> Each product features tamper-proof seals for your safety</li>
          <li><strong>Protective Outer Layer:</strong> Orders are packed in sturdy corrugated boxes with bubble wrap or cushioning to prevent damage during transit</li>
          <li><strong>Eco-Friendly Materials:</strong> We strive to use recyclable and biodegradable packaging wherever possible</li>
          <li><strong>FSSAI Compliance:</strong> All packaging displays mandatory information including manufacturing date, best-before date, net weight, MRP, FSSAI license number, and ingredient list</li>
        </ul>
      </PolicySection>

      <PolicySection number="08" title="Delivery Attempts & Failed Deliveries">
        <p>
          Our courier partners will make up to 2–3 delivery attempts at the shipping address provided. If delivery fails after all attempts:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>The package will be returned to our facility</li>
          <li>We will contact you to arrange reshipment (additional shipping charges may apply)</li>
          <li>If the return is due to an incorrect address provided by the customer, the customer will bear the reshipping cost</li>
          <li>Orders returned due to non-availability of the recipient will be refunded minus the shipping charges</li>
        </ul>
        <p className="mt-2">
          Please ensure that the delivery address and phone number provided are accurate and complete to avoid delivery issues.
        </p>
      </PolicySection>

      <PolicySection number="09" title="Damaged or Missing Items Upon Delivery">
        <p>
          If you receive a damaged, tampered, or incomplete shipment:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Do not accept the package if the outer packaging is visibly damaged. Mark it as &ldquo;Damaged&rdquo; and refuse delivery.</li>
          <li>If damage is discovered after opening, contact us within 48 hours with photographs of the product, packaging, and shipping label.</li>
          <li>We will arrange a free replacement or full refund as per our <a href="/cancellation-and-refund" className="text-[#8B1E1E] underline underline-offset-2 hover:text-[#D4AF37] transition-colors font-medium">Cancellation & Refund Policy</a>.</li>
        </ul>
      </PolicySection>

      <PolicySection number="10" title="Weather & Seasonal Delays">
        <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-200/50">
          <h4 className="text-sm font-bold text-amber-800 mb-1">⚠ Monsoon & Extreme Weather Advisory</h4>
          <p className="text-sm text-amber-900/80">
            During heavy monsoons or extreme weather events in specific regions, deliveries may be delayed to ensure the packaging and product remain completely protected from moisture. We appreciate your patience during such situations and will keep you informed of any delays via email or SMS.
          </p>
        </div>
      </PolicySection>

      <PolicySection number="11" title="Shipping Partners">
        <p>
          We partner with India&apos;s most trusted logistics providers to ensure safe and timely delivery of your orders. Our shipping partners include but are not limited to:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {['India Post', 'DTDC', 'Delhivery', 'BlueDart', 'Ecom Express', 'Shadowfax'].map((partner) => (
            <span
              key={partner}
              className="px-3 py-1.5 bg-[#F5E9DB]/30 rounded-full text-xs font-medium text-[#8B1E1E] border border-[#F5E9DB]/60"
            >
              {partner}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-[#4A3728]/60">
          <em>The courier partner assigned to your order may vary based on your delivery location and order weight.</em>
        </p>
      </PolicySection>

      <PolicySection number="12" title="International Shipping">
        <p>
          At present, we ship only within India. International shipping is not available. We are working to expand our delivery network and will update this page when international shipping becomes available.
        </p>
        <p className="mt-2">
          For international inquiries, please contact us at <a href="mailto:midhunamasala1977@gmail.com" className="text-[#8B1E1E] underline underline-offset-2 hover:text-[#D4AF37] transition-colors">midhunamasala1977@gmail.com</a> and we will try our best to accommodate your request.
        </p>
      </PolicySection>

      <PolicySection number="13" title="Contact Us">
        <p>For any shipping or delivery-related queries, please reach out to our support team:</p>
        <div className="mt-3 p-4 bg-[#8B1E1E]/[0.03] rounded-lg border border-[#8B1E1E]/10">
          <p className="font-semibold text-[#8B1E1E] mb-1">Midhuna Masala — Shipping Support</p>
          <p>Email: <a href="mailto:midhunamasala1977@gmail.com" className="text-[#8B1E1E] underline underline-offset-2 hover:text-[#D4AF37] transition-colors">midhunamasala1977@gmail.com</a></p>
          <p>Working Hours: Monday to Saturday, 9:00 AM – 6:00 PM IST</p>
        </div>
      </PolicySection>
    </PolicyLayout>
  );
}

import type { Metadata } from 'next';
import PolicyLayout, { PolicySection } from '@/components/layout/PolicyLayout';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | Midhuna Masala',
  description:
    'Understand our cancellation and refund policies for orders placed on Midhuna Masala. Know your rights as a customer.',
};

const RefundIcon = () => (
  <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

export default function CancellationAndRefundPage() {
  return (
    <PolicyLayout
      title="Cancellation & Refund Policy"
      subtitle="Fair, transparent, and customer-first — our promise to you"
      icon={<RefundIcon />}
      lastUpdated="12 May 2026"
    >
      {/* Introduction */}
      <div className="mb-10 p-5 sm:p-6 bg-[#F5E9DB]/30 rounded-xl border border-[#F5E9DB]/60">
        <p className="text-sm sm:text-base text-[#4A3728] leading-relaxed">
          At <strong className="text-[#8B1E1E]">Midhuna Masala</strong>, we take great pride in delivering the finest traditional stone-ground spices to your doorstep. We understand that there may be occasions when you need to cancel or return an order. This policy outlines the terms and conditions for cancellations, returns, and refunds. Please note that as our products are consumable food items, certain restrictions apply to maintain quality and safety standards.
        </p>
      </div>

      <PolicySection number="01" title="Order Cancellation">
        <p>You may cancel your order subject to the following conditions:</p>
        <div className="mt-3 space-y-3">
          <div className="p-4 bg-green-50/50 rounded-lg border border-green-200/50">
            <h4 className="text-sm font-bold text-green-800 mb-1">✓ Cancellation Before Dispatch</h4>
            <p className="text-sm text-green-900/70">
              Orders may be cancelled free of charge at any time before the order is dispatched. A full refund will be initiated to your original payment method within 5–7 business days.
            </p>
          </div>
          <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-200/50">
            <h4 className="text-sm font-bold text-amber-800 mb-1">⚠ Cancellation After Dispatch</h4>
            <p className="text-sm text-amber-900/70">
              Once an order has been dispatched, it cannot be cancelled. In such cases, you may refuse delivery, and a refund will be processed after the product is returned to our facility, minus applicable shipping charges.
            </p>
          </div>
        </div>
        <p className="mt-3">
          If a package is returned to us due to an incorrect/incomplete address provided by the customer, or failure to accept delivery after multiple attempts, a refund will be issued minus the forward and return shipping charges.
        </p>
        <p className="mt-2">
          To cancel an order, please contact our support team at <a href="mailto:midhunamasala1977@gmail.com" className="text-[#8B1E1E] underline underline-offset-2 hover:text-[#D4AF37] transition-colors">midhunamasala1977@gmail.com</a> with your order number.
        </p>
      </PolicySection>

      <PolicySection number="02" title="Return Policy">
        <p>
          Due to the perishable and consumable nature of our spice products, we maintain a strict return policy to ensure food safety and hygiene. Returns are accepted only under the following circumstances:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li><strong>Damaged Products:</strong> If the product was damaged during transit (broken seal, torn packaging, spillage)</li>
          <li><strong>Wrong Product:</strong> If you received a product different from what was ordered</li>
          <li><strong>Quality Issues:</strong> If the product appears significantly different from the description (contamination, foul smell, visible defects)</li>
          <li><strong>Expired Products:</strong> If the product received is past its expiry or best-before date</li>
        </ul>

        <div className="mt-4 p-4 bg-red-50/40 rounded-lg border border-red-200/40">
          <h4 className="text-sm font-bold text-red-800 mb-1">✗ Returns NOT Accepted</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-red-900/70">
            <li>Products opened or used by the customer</li>
            <li>Change of mind after delivery</li>
            <li>Minor variations in colour, texture, or aroma (natural for hand-crafted spices)</li>
            <li>Products where the return request is raised beyond the specified timeframe</li>
          </ul>
        </div>
      </PolicySection>

      <PolicySection number="03" title="Return Process">
        <p>To initiate a return, please follow these steps:</p>
        <div className="mt-3 space-y-3">
          {[
            {
              step: '1',
              title: 'Report the Issue',
              desc: (
                <>
                  Contact us within 48 hours of delivery via email with your order number, a description of the issue, and clear photographs of the product and packaging.
                  <span className="block mt-2 p-3 bg-amber-50/50 rounded-lg border border-amber-200/50 text-sm text-amber-900/80">
                    <strong className="text-amber-800">⚠ Important:</strong> To process claims for damaged, missing, or incorrect items seamlessly, an unboxing video showing the sealed package being opened is <strong>mandatory</strong>. The video must be unedited and clearly show the shipping label.
                  </span>
                </>
              ),
            },
            { step: '2', title: 'Verification', desc: 'Our quality assurance team will review your request and may ask for additional information or photographs. We aim to respond within 24–48 hours.' },
            { step: '3', title: 'Approval & Pickup', desc: 'If your return is approved, we will arrange a reverse pickup at no additional cost, or provide instructions for returning the product.' },
            { step: '4', title: 'Inspection', desc: 'Once the returned product is received and inspected at our facility, we will process the refund or replacement as applicable.' },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#8B1E1E] text-white text-xs font-bold flex items-center justify-center">
                {item.step}
              </span>
              <div>
                <p className="font-semibold text-[#8B1E1E] text-sm">{item.title}</p>
                <div className="text-sm text-[#4A3728]/80 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </PolicySection>

      <PolicySection number="04" title="Refund Policy">
        <p>Refunds are processed as follows:</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#8B1E1E]/5">
                <th className="text-left p-3 font-semibold text-[#8B1E1E] border border-[#F5E9DB]">Scenario</th>
                <th className="text-left p-3 font-semibold text-[#8B1E1E] border border-[#F5E9DB]">Refund Amount</th>
                <th className="text-left p-3 font-semibold text-[#8B1E1E] border border-[#F5E9DB]">Timeline</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-[#F5E9DB]">Cancellation before dispatch</td>
                <td className="p-3 border border-[#F5E9DB]">Full refund (100%)</td>
                <td className="p-3 border border-[#F5E9DB]">5–7 business days</td>
              </tr>
              <tr className="bg-[#F5E9DB]/15">
                <td className="p-3 border border-[#F5E9DB]">Refused delivery / cancellation after dispatch</td>
                <td className="p-3 border border-[#F5E9DB]">Order amount minus shipping charges</td>
                <td className="p-3 border border-[#F5E9DB]">7–10 business days</td>
              </tr>
              <tr>
                <td className="p-3 border border-[#F5E9DB]">Damaged / wrong / defective product</td>
                <td className="p-3 border border-[#F5E9DB]">Full refund or free replacement</td>
                <td className="p-3 border border-[#F5E9DB]">5–7 business days (after inspection)</td>
              </tr>
              <tr className="bg-[#F5E9DB]/15">
                <td className="p-3 border border-[#F5E9DB]">Partial order issues</td>
                <td className="p-3 border border-[#F5E9DB]">Refund for affected item(s) only</td>
                <td className="p-3 border border-[#F5E9DB]">5–7 business days</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          Refunds will be credited to the original payment method used during purchase. Please allow additional time for your bank or payment provider to process the credit.
        </p>
      </PolicySection>

      <PolicySection number="05" title="Non-Refundable Items">
        <p>The following items and scenarios are not eligible for a refund:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Products purchased during clearance sales or promotional offers (unless defective)</li>
          <li>Gift cards or store credits</li>
          <li>Shipping charges (except in cases of our error)</li>
          <li>Products damaged due to mishandling by the customer after delivery</li>
        </ul>
      </PolicySection>

      <PolicySection number="06" title="Replacement Policy">
        <p>
          In cases where a refund is not preferred, we offer a one-time replacement of the product at no additional cost. Replacements are subject to product availability. If the original product is out of stock, a full refund will be processed instead.
        </p>
      </PolicySection>

      <PolicySection number="07" title="Late or Missing Refunds">
        <p>If you have not received your refund within the stated timeline, please:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Check your bank account or payment method statement</li>
          <li>Contact your bank or credit card company, as processing times may vary</li>
          <li>If you have completed these steps and still have not received your refund, contact us at <a href="mailto:midhunamasala1977@gmail.com" className="text-[#8B1E1E] underline underline-offset-2 hover:text-[#D4AF37] transition-colors">midhunamasala1977@gmail.com</a></li>
        </ul>
      </PolicySection>

      <PolicySection number="08" title="Contact Us">
        <p>For any cancellation, return, or refund-related queries, please reach out to us:</p>
        <div className="mt-3 p-4 bg-[#8B1E1E]/[0.03] rounded-lg border border-[#8B1E1E]/10">
          <p className="font-semibold text-[#8B1E1E] mb-1">Midhuna Masala — Customer Support</p>
          <p>Email: <a href="mailto:midhunamasala1977@gmail.com" className="text-[#8B1E1E] underline underline-offset-2 hover:text-[#D4AF37] transition-colors">midhunamasala1977@gmail.com</a></p>
          <p>Working Hours: Monday to Saturday, 9:00 AM – 6:00 PM IST</p>
          <p className="mt-2 text-xs text-[#4A3728]/60">
            Please keep your order number, payment receipt, and any supporting photographs ready when contacting us for faster resolution.
          </p>
        </div>
      </PolicySection>
    </PolicyLayout>
  );
}

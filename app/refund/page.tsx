export default function RefundPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 md:px-8 py-10">
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Legal</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl">Refund &amp; Cancellation Policy</h1>
      </div>

      <div className="glass rounded-lg p-6 md:p-10 space-y-8 text-fog text-sm leading-relaxed">
        <p className="text-fog-dim text-xs font-mono">Last updated: September 2026</p>

        <section>
          <h2 className="font-display font-semibold text-lg text-white mb-3">1. Digital Products — General Policy</h2>
          <p>Due to the nature of digital products, all sales on GtaBolts are generally considered final once the product has been downloaded. Since digital content can be copied and cannot be &quot;returned,&quot; we follow a strict but fair refund policy as outlined below.</p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-white mb-3">2. Eligible Refund Scenarios</h2>
          <p>We will issue a full refund in the following cases:</p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-fog">
            <li><strong className="text-white">Duplicate Purchase:</strong> If you accidentally purchased the same product twice, we will refund the duplicate transaction.</li>
            <li><strong className="text-white">Product Not Delivered:</strong> If a purchased product is not available for download within 24 hours of payment confirmation, you are eligible for a full refund.</li>
            <li><strong className="text-white">Significantly Misrepresented Product:</strong> If the delivered product is fundamentally different from its description or screenshots on the listing page.</li>
            <li><strong className="text-white">Corrupted or Non-Functional File:</strong> If the downloaded file is corrupted and the creator fails to provide a working replacement within 48 hours.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-white mb-3">3. Non-Refundable Scenarios</h2>
          <p>Refunds will not be issued for:</p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-fog">
            <li>Change of mind after purchase.</li>
            <li>Incompatibility with your system or game version (check requirements before buying).</li>
            <li>Products that have already been successfully downloaded.</li>
            <li>Dissatisfaction with subjective quality (e.g., &quot;I didn&apos;t like how it looks&quot;).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-white mb-3">4. How to Request a Refund</h2>
          <p>To request a refund, contact us via email with the following details:</p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-fog">
            <li>Your registered email address.</li>
            <li>Order/Transaction ID.</li>
            <li>Name of the product purchased.</li>
            <li>Reason for the refund request.</li>
          </ul>
          <p className="mt-3">Refund requests must be submitted within <strong className="text-white">7 days</strong> of the purchase date.</p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-white mb-3">5. Refund Processing</h2>
          <p>Approved refunds will be processed within <strong className="text-white">5–10 business days</strong>. The refund will be credited back to the original payment method used during the purchase.</p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-white mb-3">6. Cancellation</h2>
          <p>Since digital products are delivered instantly upon payment, orders cannot be cancelled after payment is completed. If you wish to cancel before completing payment, simply close the payment window.</p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-white mb-3">7. Contact Us</h2>
          <p>For refund requests or questions about this policy, please reach out to us through the contact channels listed on our website. We aim to respond to all queries within 24–48 hours.</p>
        </section>
      </div>
    </div>
  );
}

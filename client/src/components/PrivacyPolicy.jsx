const PrivacyPolicy = () => {
  return (
     <>
    <div className="max-w-5xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p>
          Thank you for choosing our services offered by Asipiya Soft Solutions Private Limited, a subsidiary of Asipiya International Private Limited. At Asipiya, we care deeply about your privacy. We only request the minimal information necessary to provide our services and are committed to protecting your personal data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <h3 className="text-xl font-medium mb-2">Provided by You</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Account Information:</strong> We collect personal details such as name, email, phone number, and login credentials when you sign up.
          </li>
          <li>
            <strong>Payment Information:</strong> When subscribing to a plan, we collect relevant billing details. These are used strictly for processing and are stored only when needed for recurring payments or legal obligations.
          </li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-2">Collected Automatically</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Usage Information:</strong> Includes feature usage, time spent, clicks, scrolls, errors, and settings.
          </li>
          <li>
            <strong>Device Information:</strong> Includes IP address, browser type, operating system, and device model for compatibility and performance optimization.
          </li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-2">From Third Parties</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Login Information:</strong> If using social logins like Google or Facebook, we may receive basic profile and email data to ease sign-in.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Use of Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To communicate with you about services, updates, notifications, support, and promotions.</li>
          <li>To deliver, support, and improve our platform and services.</li>
          <li>To personalize user experience and analyze feedback and usage behavior.</li>
          <li>To process transactions, manage billing, and notify of any issues.</li>
          <li>To detect and prevent fraudulent activities and ensure security.</li>
          <li>To perform analytics for service and experience improvements.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>With Your Consent:</strong> We share data only when you give explicit permission.</li>
          <li><strong>Employees:</strong> Shared internally only for operational purposes with confidentiality obligations.</li>
          <li><strong>Service Providers:</strong> Used for payment processing, analytics, or support under strict terms.</li>
          <li><strong>Legal Compliance:</strong> Disclosed when required by law or government authorities.</li>
          <li><strong>Protection of Rights:</strong> Shared to protect Asipiya’s legal interests or public safety.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Retention of Information</h2>
        <p>
          We retain your personal data as long as necessary to fulfill the purposes outlined in this policy. In some cases, we may retain it longer for legal or compliance reasons. Once no longer required, your data will be deleted or anonymized from our active systems and backups.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
        <p>
          We implement administrative, technical, and physical safeguards to protect your data. Please refer to our <a href="/security-policy" className="text-blue-600 underline">Security Policy</a> for more details.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Protection Officer</h2>
        <p>
          We've appointed a Data Protection Officer (DPO) to oversee compliance. For any concerns or queries, you may contact the DPO via email at <strong>privacy@asipiya.com</strong> (replace with your actual address).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
        <p>
          We use persistent cookies to enhance your experience. These cookies remain on your browser until you delete them or they expire.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Disclosures for Legal Obligations</h2>
        <p>
          If required by law or national security demands, we may preserve or disclose your data to relevant authorities.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Compliance with this Policy</h2>
        <p>
          We conduct periodic reviews to ensure compliance. If you have any concerns, please email us at <strong>privacy@asipiya.com</strong>. We will work with appropriate regulatory authorities to address them.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Changes to Privacy Policy</h2>
        <p>
          This Privacy Policy may be updated anytime. You will be notified via service announcements or emails (make sure your email is verified). For significant changes, we’ll notify you 30 days in advance.
        </p>
      </section>

      <section className="mb-8 text-center text-sm text-gray-600">
        <p>Last updated: June 2025</p>
      </section>
    </div>
   </>
  );
};

export default PrivacyPolicy;

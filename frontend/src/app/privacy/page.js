import React from "react";

export default function PrivacyDisclaimer() {
  return (
    <div className="bg-white text-gray-800 px-6 py-10 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Privacy</h1>
      <p className="text-sm text-gray-500">Last updated: March 18, 2025</p>

      <h2 className="text-2xl font-semibold mt-4">Privacy Disclaimer for Finear</h2>
      <p>
        Finear is deeply committed to safeguarding the privacy and personal data of its users. This comprehensive Privacy Disclaimer clearly outlines our practices regarding the collection, use, protection, and management of your personal information when you interact with our website.
      </p>

      <section>
        <h3 className="text-xl font-semibold mt-6">Collection of Personal Data</h3>
        <p>
          Finear collects only essential information necessary to effectively provide our services. This may include data voluntarily provided by you through online forms, registration processes, surveys, feedback submissions, or direct correspondence, such as your name, email address, phone number, company affiliation, payment information, and additional details required for seamless business interactions.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-6">Use of Data</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Providing, managing, and continuously improving requested services</li>
          <li>Customizing and enhancing user experience</li>
          <li>Developing and refining our commercial offerings</li>
          <li>Conducting market research and statistical analyses</li>
          <li>Communicating important updates and promotional content</li>
        </ul>
        <p>
          Your data will never be sold, rented, exchanged, or disclosed to third parties without your explicit consent, except as required by law.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-6">Data Protection</h3>
        <p>
          Collaterize employs rigorous technical and organizational security measures to protect your personal data from unauthorized access, loss, theft, misuse, or destruction.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-6">Cookies and Similar Technologies</h3>
        <p>
          We use cookies and tracking technologies to enhance your experience. You can manage or disable cookies via your browser settings.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-6">Your Rights</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Access and review your data</li>
          <li>Request corrections or deletions</li>
          <li>Object to or restrict processing</li>
          <li>Request data portability</li>
        </ul>
        <p>
          To exercise any rights, contact us at <a href="mailto:hello@collaterize.com" className="text-blue-600 underline">hello@collaterize.com</a>.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-6">Third-Party Links and Content</h3>
        <p>
          Collaterize is not responsible for the privacy practices or content of third-party websites or platforms linked on our site.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-6">International Data Transfers</h3>
        <p>
          If personal data is transferred internationally, we ensure appropriate safeguards are in place in compliance with data protection laws.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-6">Retention of Personal Data</h3>
        <p>
          Data is retained only as long as needed for the purposes described and to meet legal requirements. Unneeded data is deleted or anonymized.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-6">Changes to this Disclaimer</h3>
        <p>
          We may update this disclaimer periodically. Continued use of our site indicates acceptance of the latest version.
        </p>
      </section>

      <footer className="border-t pt-4 text-sm text-gray-500">
        <p>© 2025 - Collaterize. Tous droits réservés.</p>
        <p>© 2025 Collaterize Group SAS, 128 Rue de la Boétie, 75008 Paris, France. All rights reserved.</p>
      </footer>
    </div>
  );
}

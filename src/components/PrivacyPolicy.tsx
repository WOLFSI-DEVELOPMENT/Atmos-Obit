import React from 'react';
import { LegalPage } from './LegalPage';

interface Props {
  onNavigate: (view: 'landing' | 'app' | 'privacy' | 'terms' | 'blog' | 'pricing' | 'auth' | 'articles') => void;
}

export function PrivacyPolicy({ onNavigate }: Props) {
  const intro = (
    <p>
      Atmos Orbit ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Atmos Orbit when you use our website, web application, and Roblox Studio plugins.
    </p>
  );

  const sections = [
    {
      id: "information-collection",
      title: "Information Collection",
      content: (
        <>
          <p>
            We collect several different types of information for various purposes to provide and improve our Service to you.
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2 text-[#8a8a8a]">
            <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you, such as your email address and name.</li>
            <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used. This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, and the time and date of your visit.</li>
            <li><strong>Project Data:</strong> The prompts you enter, the scripts generated, and the structure of your Roblox projects that are synced with Atmos Orbit are processed by our servers to provide the AI generation features.</li>
          </ul>
        </>
      )
    },
    {
      id: "use-of-data",
      title: "Use of Data",
      content: (
        <>
          <p>Atmos Orbit uses the collected data for various purposes:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2 text-[#8a8a8a]">
            <li>To provide and maintain the Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer care and support</li>
            <li>To provide analysis or valuable information so that we can improve the Service</li>
            <li>To monitor the usage of the Service and detect, prevent and address technical issues</li>
          </ul>
        </>
      )
    },
    {
      id: "data-security",
      title: "Data Security",
      content: (
        <p>
          The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data and Project Data, we cannot guarantee its absolute security. We encrypt sensitive data such as connection PINs and use secure protocols for our Studio plugin communication.
        </p>
      )
    },
    {
      id: "service-providers",
      title: "Service Providers",
      content: (
        <p>
          We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties (such as OpenAI, Anthropic, or Google Cloud) may have access to your Project Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
        </p>
      )
    },
    {
      id: "contact-us",
      title: "Contact Us",
      content: (
        <p>
          If you have any questions about this Privacy Policy, please contact us at privacy@atmosorbit.com.
        </p>
      )
    }
  ];

  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="August 12, 2026"
      readingTime="4 min"
      intro={intro}
      sections={sections}
      onNavigate={onNavigate}
    />
  );
}

import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Privacy Policy | Talha Codes",
  description: "Privacy Policy for Talha Codes' portfolio and tech blog website. Covers details on data collection, cookies, and Google AdSense compliance.",
  keywords: [
    "Privacy Policy",
    "Talha Codes Privacy",
    "AdSense Cookie Policy",
    "Data Collection Disclosure"
  ],
  openGraph: {
    title: "Privacy Policy | Talha Codes",
    description: "Privacy Policy explaining data collection practices and cookies usage for Google AdSense compliance.",
    type: "website",
    url: "https://talhacodes.site/privacy",
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 text-zinc-800 dark:text-gray-100 animate-fadeIn">
      <Heading title="Privacy Policy" />
      
      <div className="mt-8 space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed font-light text-sm sm:text-base">
        <p>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <p>
          At <strong>Talha Codes Portfolio & Blog</strong> (accessible from <Link href="/" className="text-[#e49505] hover:underline font-semibold">talhacodes.site</Link>), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by our website and how we use it.
        </p>

        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 border-b border-zinc-200 dark:border-white/5 pb-2">Log Files</h2>
        <p>
          Our website follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services&apos; analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users&apos; movement on the website, and gathering demographic information.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 border-b border-zinc-200 dark:border-white/5 pb-2">Cookies and Web Beacons</h2>
        <p>
          Like any other website, our website uses &apos;cookies&apos;. These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 border-b border-zinc-200 dark:border-white/5 pb-2">Google DoubleClick DART Cookie</h2>
        <p>
          Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-[#e49505] hover:underline font-semibold">https://policies.google.com/technologies/ads</a>
        </p>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 border-b border-zinc-200 dark:border-white/5 pb-2">Our Advertising Partners</h2>
        <p>
          Some of advertisers on our site may use cookies and web beacons. Our advertising partners include:
        </p>
        <ul className="list-disc list-inside pl-4 space-y-2">
          <li>
            <strong>Google AdSense:</strong> Their Privacy Policy can be found at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-[#e49505] hover:underline font-semibold">https://policies.google.com/technologies/ads</a>.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 border-b border-zinc-200 dark:border-white/5 pb-2">Third Party Privacy Policies</h2>
        <p>
          Our Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
        </p>
        <p>
          You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers&apos; respective websites.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 border-b border-zinc-200 dark:border-white/5 pb-2">CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
        <p>
          Under the CCPA, among other rights, California consumers have the right to:
        </p>
        <ul className="list-disc list-inside pl-4 space-y-2">
          <li>Request that a business that collects a consumer&apos;s personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
          <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
          <li>Request that a business that sells a consumer&apos;s personal data, not sell the consumer&apos;s personal data.</li>
        </ul>
        <p>
          If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 border-b border-zinc-200 dark:border-white/5 pb-2">GDPR Data Protection Rights</h2>
        <p>
          We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
        </p>
        <ul className="list-disc list-inside pl-4 space-y-2">
          <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
          <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</li>
          <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
          <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
          <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
          <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
        </ul>
        <p>
          If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 border-b border-zinc-200 dark:border-white/5 pb-2">Children&apos;s Information</h2>
        <p>
          Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
        </p>
        <p>
          Our website does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 border-b border-zinc-200 dark:border-white/5 pb-2">Consent</h2>
        <p>
          By using our website, you hereby consent to our Privacy Policy and agree to its terms.
        </p>
      </div>
    </div>
  );
}

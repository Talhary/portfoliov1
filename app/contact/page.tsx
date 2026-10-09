import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import Component from '@/app/contact/_components/contact';

export const metadata: Metadata = {
  title: "Contact talhatechs | Company Inquiries & Founder Access",
  description: "Get in touch with talhatechs and founder Muhammad Talha. Send a message to discuss software development contracts, enterprise systems, or desktop utility collaborations.",
  alternates: {
    canonical: "/contact",
  },
  keywords: [
    "Contact talhatechs",
    "talhatechs email",
    "Hire software engineer Islamabad",
    "Muhammad Talha Contact",
    "Native software development",
    "Web engineering services"
  ],
  openGraph: {
    title: "Contact talhatechs | Company Inquiries & Founder Access",
    description: "Get in touch with talhatechs and founder Muhammad Talha. Send a message to discuss projects, enterprise contracts, or technical inquiries.",
    type: "website",
    url: "https://talhacodes.site/contact",
  }
};

const Page = () => {
  return (
    <>
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-3">
          <span>talhatechs · Inquiries</span>
        </div>
        <Heading title="Contact talhatechs & Leadership" />
        <Component />
      </div>
    </>
  );
};
export default Page;

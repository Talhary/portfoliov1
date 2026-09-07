
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import Component from '@/app/contact/_components/contact'

export const metadata: Metadata = {
  title: "Contact Talha Codes | Hire Full Stack Developer",
  description: "Get in touch with Talha Codes, a Full Stack Software Engineer based in Islamabad. Send a message to discuss project details, jobs, or collaborations.",
  alternates: {
    canonical: "/contact",
  },
  keywords: [
    "Contact Talha Codes",
    "Talha Codes email",
    "Hire software engineer Islamabad",
    "Full stack developer contact",
    "Web development services"
  ],
  openGraph: {
    title: "Contact Talha Codes | Hire Full Stack Developer",
    description: "Get in touch with Talha Codes, a Full Stack Software Engineer. Send a message to discuss projects, jobs, or collaborations.",
    type: "website",
    url: "https://talhacodes.site/contact",
  }
};

const Page = () => {
  return (
    <>
      <div>
        <Heading title="Contact" />
        <Component />
      </div>
    </>
  );
};
export default Page;


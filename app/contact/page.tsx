
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import Component from '@/app/contact/_components/contact'

export const metadata: Metadata = {
  title: "Contact Talha Riaz | Hire Full Stack Developer",
  description: "Get in touch with Muhammad Talha Riaz, a Full Stack Software Engineer based in Islamabad. Send a message to discuss project details, jobs, or collaborations.",
  keywords: [
    "Contact Talha Riaz",
    "Talha Riaz email",
    "Hire software engineer Islamabad",
    "Full stack developer contact",
    "Web development services"
  ],
  openGraph: {
    title: "Contact Talha Riaz | Hire Full Stack Developer",
    description: "Get in touch with Muhammad Talha Riaz, a Full Stack Software Engineer. Send a message to discuss projects, jobs, or collaborations.",
    type: "website",
    url: "https://talhatech.vercel.app/contact",
  }
};

const Page = () => {
  return (
    <>
       <div>
       <Heading title="Contact"/>
       <Component/>
     </div>
    </>
  );
};
export default Page;


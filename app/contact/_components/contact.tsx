
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Component() {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 md:px-0 py-12 md:py-20  dark:text-gray-100">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Get in Touch</h2>
              <p className="text-gray-200 dark:text-gray-400">
                Have a question or want to work together? Fill out the form below or use the contact info to the right.
              </p>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="dark:text-gray-100">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className=" dark:text-gray-100 dark:border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="dark:text-gray-100">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className=" dark:text-gray-100 dark:border-gray-700"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="message" className="dark:text-gray-100">
                  Message
                </Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="How can I help you?"
                  className=" dark:text-gray-100 dark:border-gray-700"
                />
              </div>
              <Button type="submit" className="dark:bg-primary w-full dark:text-black bg-primary dark:hover:scale-[1.01] transition-all duration-200">
                Send Message
              </Button>
            </form>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Contact Info</h2>
              <p className="text-gray-200 dark:text-gray-400">
                Reach out to me using the information below.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5 text-primary dark:text-gray-400" />
                <span className="dark:text-gray-100">+92-318-5853847</span>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="h-5 w-5 text-primary dark:text-gray-400" />
                <span className="dark:text-gray-100">talhariaz5425869@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <GlobeIcon className="h-5 w-5 text-primary dark:text-gray-400" />
                <Link href="https://talhatech.vercel.app" className="hover:underline dark:text-gray-100" prefetch={false}>
                  talhatech.vercel.app
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-primary dark:text-gray-400" />
                <span className="dark:text-gray-100">Bhara Kahu, Islamabad</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  function MapPinIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        fill="#ffffff"
        viewBox="0 0 368.666 368.666"
      >
        <g>
          <g>
            <path d="M184.333,0C102.01,0,35.036,66.974,35.036,149.297c0,33.969,11.132,65.96,32.193,92.515     c27.27,34.383,106.572,116.021,109.934,119.479l7.169,7.375l7.17-7.374c3.364-3.46,82.69-85.116,109.964-119.51     c21.042-26.534,32.164-58.514,32.164-92.485C333.63,66.974,266.656,0,184.333,0z M285.795,229.355     c-21.956,27.687-80.92,89.278-101.462,110.581c-20.54-21.302-79.483-82.875-101.434-110.552     c-18.228-22.984-27.863-50.677-27.863-80.087C55.036,78.002,113.038,20,184.333,20c71.294,0,129.297,58.002,129.296,129.297     C313.629,178.709,304.004,206.393,285.795,229.355z"/>
            <path d="M184.333,59.265c-48.73,0-88.374,39.644-88.374,88.374c0,48.73,39.645,88.374,88.374,88.374s88.374-39.645,88.374-88.374     S233.063,59.265,184.333,59.265z M184.333,216.013c-37.702,0-68.374-30.673-68.374-68.374c0-37.702,30.673-68.374,68.374-68.374     s68.373,30.673,68.374,68.374C252.707,185.341,222.035,216.013,184.333,216.013z"/>
          </g>
        </g>
      </svg>
    );
  }
  
function GlobeIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
}


function LinkedinIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}


function MailIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}


function PhoneIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}


function TwitterIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}
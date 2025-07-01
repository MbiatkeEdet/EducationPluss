import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
import { FaTelegramPlane } from "react-icons/fa";

export default function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { text: "AI Writing Help", href: "/signup" },
        { text: "Task Manager", href: "/signup" },
        { text: "Study Tools", href: "/signup" },
        { text: "Exam Prep", href: "/signup" },
      ]
    },
    {
      title: "Company",
      links: [
        { text: "About Us", href: "/about" },
        { text: "Contact", href: "/contact" },
      ]
    },
    {
      title: "Resources",
      links: [
        { text: "Roadmap", href: "/roadmap" },
        { text: "Privacy Policy", href: "/privacy" },
      ]
    }
  ];

  const socials = [
    { icon: <BsTwitterX />, href: "https://www.twitter.com/@Finear_app" },
    { icon: <FaTelegramPlane />, href: "https://t.me/Finear_app" },


  ];

  return (
    <footer className="bg-indigo-900 text-white py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <div className="relative h-10 w-36">
                <Image
                  src="/logo-main.png"
                  alt="Finear logo"
                  width={120}
                  height={120}
                
                />
              </div>
            </Link>
            <p className="text-indigo-200 max-w-md mt-0">
              Revolutionizing education with AI-powered tools and blockchain rewards. Helping students achieve academic excellence while earning cryptocurrency.
            </p>
            <div className="flex gap-4 text-xl text-indigo-200">
              {socials.map((social, index) => (
                <Link
                  href={social.href}
                  key={index}
                  aria-label={`Visit our ${social.href.split(".")[1]} page`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400 transition"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Link Columns */}
          {footerLinks.map((column, columnIndex) => (
            <div key={columnIndex} className="space-y-4">
              <h3 className="font-semibold text-lg text-yellow-400">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="text-indigo-200 hover:text-white transition">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-indigo-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-indigo-300 text-sm">
            ©2025 Finear | All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-indigo-300 text-sm hover:text-white">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-indigo-300 text-sm hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-indigo-300 text-sm hover:text-white">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
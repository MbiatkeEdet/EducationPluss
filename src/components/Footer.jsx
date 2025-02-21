import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaYoutube,
  } from "react-icons/fa6";
  import { BsTwitterX } from "react-icons/bs";
  import Link from "next/link";
  
  export default function Footer() {
    const footerLinks = [
      { text: "About Us", href: "/about" },
      { text: "Writing Help", href: "/writing help" },
      { text: "Task Manager", href: "/task manager" },
      { text: "Study Tools", href: "/study tools" },
      { text: "Exam Prep", href: "/exam prep" },
      { text: "Contact", href: "/contact" },
      { text: "Privacy Policy", href: "/privacy-policy" },
    ];
  
    const socials = [
      { icon: <FaLinkedin />, href: "https://www.linkedin.com" },
      { icon: <BsTwitterX />, href: "https://www.twitter.com/@Ed_Plus_" },
      { icon: <FaInstagram />, href: "https://www.instagram.com" },
      { icon: <FaFacebook />, href: "https://www.facebook.com" },
      { icon: <FaYoutube />, href: "https://www.youtube.com" },
    ];
  
    return (
      <footer className="bg-yellow-400 text-black py-8 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Logo and Social Icons */}
          <div className="space-y-4">
            <Link href="/">
              <img src="/skilloft.png" alt="Education+ logo" width={140} />
            </Link>
            <div className="flex gap-4 text-2xl text-black">
              {socials.map((social, index) => (
                <Link
                  href={social.href}
                  key={index}
                  aria-label={`Visit our ${social.href.split(".")[1]} page`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
  
          {/* Footer Links */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {footerLinks.map((link, index) => (
              <Link href={link.href} key={index} className="text-base hover:underline">
                {link.text}
              </Link>
            ))}
          </div>
  
          {/* Copyright Section */}
          <div className="text-center md:text-left">
            <p className="text-sm">
              ©2024 Education+
              <br /> All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }
  
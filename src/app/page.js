import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Product from "@/components/Product";
import Services from "@/components/Services";
import Link from 'next/link';
import Documentation from "./documentation/page";
import Sidebar from "@/components/Sidebar";
import BackgroundImage from "@/components/BackgroundImage";




export default function Home() {
  return (
    <>
    
      <Hero />
      <Product />
      <Services />
      
      
      <Footer />
    </>
  )
}

import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Product from "@/components/Product";
import Services from "@/components/Services";
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Education+ | AI-Powered Learning with Crypto Rewards</title>
        <meta name="description" content="Revolutionize your learning with AI-powered tools and earn crypto rewards for achieving your academic goals." />
      </Head>
      
      <main>
        <Hero />
        <Product />
        <Services />
      </main>
      
      <Footer />
    </>
  )
}
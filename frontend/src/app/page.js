import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Product from "@/components/Product";
import Services from "@/components/Services";

export const metadata = {
  title: "Finear | AI-Powered Learning with Crypto Rewards",
  description: "Revolutionize your learning with AI-powered tools and earn crypto rewards for achieving your academic goals.",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Product />
      <Services />
      <Footer />
    </main>
  );
}
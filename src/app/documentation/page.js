import Navbar from '@/components/Navbar';
import Link from 'next/link';
export default function Documentation() {
    return (
      <>
      <Link href="/"></Link>
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold">Documentation Page</h1>
        <p>Welcome to the Documentation section.</p>
      </div>
      </>
    );
  }
  
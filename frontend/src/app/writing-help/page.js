import Link from "next/link";
export default function WritingHelp() {
    return (

        
      <div className="p-8">
        <h1 className="text-2xl font-bold">Writing help</h1>
        <p>Welcome to the Documentation section.</p>

        <Link href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Go to Home
      </Link>
      </div>
    );
  }
  
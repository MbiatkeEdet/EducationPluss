import Link from "next/link";
export default function ExamPrep() {
    return (

        
      <div className="p-8">
        <h1 className="text-2xl font-bold">Examination Preparation</h1>
        <p>Get ready for your exams with useful resources, tips, and strategies!</p>



        <Link href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Go to Home
      </Link>
      </div>
    );
  }
  
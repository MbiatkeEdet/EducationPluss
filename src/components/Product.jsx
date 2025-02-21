import React from 'react'
import Link from 'next/link';

function Product() {
  return (
    <section className="bg-[url('/robot.jpg')] bg-cover bg-center bg-no-repeat opacity-40 md:opacity-100">
      <div className='bg-black text-white py-8 px-6 md:px-12'>
        <div>
         <h1 className='text-2xl font-bold mb-3 flex justify-center'>Success Stories: Empower Your Journey With Our Virtual Lab Experience</h1>
        </div>
        <div className='grid grid-cols-3 flex justify-items-center sm:grid-cols-2 lg:grid-cols-4 gap-9'>
        <div className="bg-white shadow-lg p-6 gap-18 rounded-xl transform transition hover:scale-105">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">AI Writing Assistant</h2>
      <p className="text-gray-700">
        Improve your essays,reports and writing projects <br />with AI-powered proofreading.
      </p>

      <Link href="/writing-help">
      <button className='px-3 py-3 border border-black text-black rounded-xl justify-items-center gap-4 mt-6 bg-yellow-300'>Get started</button>
            </Link>
    </div>
    <div className="bg-white shadow-lg p-6 gap-18 rounded-xl transform transition hover:scale-105">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Task Planner</h2>
      <p className="text-gray-700">
        Manage assignments,deadlines and schedules with <br /> smart AI suggestions.
      </p>
    </div>
    <div className="bg-white shadow-lg p-6 gap-18 rounded-xl transform transition hover:scale-105">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Exam Prep & Quizzes</h2>
      <p className="text-gray-700">
        Practice with AI-generated quizzes and personalized <br /> study plans.
      </p>
    </div>
        </div>
        </div>

        
    </section>
  )
}

export default Product
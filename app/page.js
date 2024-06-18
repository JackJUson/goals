// app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen p-6 bg-background text-foreground'>
      <h1 className='text-6xl font-heading mb-4 text-primary font-[600]'>
        Welcome to Goal Tracker
      </h1>
      <p className='text-base mb-8 text-muted-foreground'>Track your goals and achieve more!</p>
      <Link href='/dashboard'>
        <button className='btn btn-outline bg-primary text-primary-foreground btn-wide font-medium'>
          Go to Dashboard
        </button>
      </Link>
    </main>
  );
}

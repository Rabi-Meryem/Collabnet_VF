import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#0b1526] border-t border-gray-800 py-8 px-6">
      <div className="flex flex-col md:flex-row justify-between max-w-6xl mx-auto text-sm text-gray-400">
        <div>
          <p>© 2025 CollabScience. All rights reserved</p>
          <p>Powered by Next.js, Supabase, and Vercel. Designed with ❤️ using Figma.</p>
        </div>
        <div className="mt-6 md:mt-0">
          <p className="font-semibold text-white mb-2">Quick Links</p>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
        <div className="mt-6 md:mt-0">
          <p className="font-semibold text-white mb-2">Contact Us</p>
          <div className="flex gap-3">
            <Image src="/gmail.png" alt="gmail" width={20} height={20} />
            <Image src="/linkedin.png" alt="linkedin" width={20} height={20} />
            <Image src="/github.png" alt="github" width={20} height={20} />
          </div>
        </div>
      </div>
    </footer>
  );
} 
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1B3A6E] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand & Mission */}
        <div className="space-y-4">
          <h2 className="text-2xl font-[900] tracking-tight text-white" style={{ fontFamily: 'var(--font-nunito-var)' }}>
            Parikshanam
          </h2>
          <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-sm" style={{ fontFamily: 'var(--font-roboto-var)' }}>
            Empowering students in Grades 6–10 with high-energy, tactile learning experiences. 
            Learn smart. Compete hard. Win big.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-[800] uppercase tracking-widest text-[#E8720C]" style={{ fontFamily: 'var(--font-nunito-var)' }}>
            Explore
          </h3>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="text-sm text-[#E5E7EB] hover:text-[#E8720C] transition-colors">Home</Link>
            <Link href="#" className="text-sm text-[#E5E7EB] hover:text-[#E8720C] transition-colors">About Us</Link>
            <Link href="#" className="text-sm text-[#E5E7EB] hover:text-[#E8720C] transition-colors">Courses</Link>
          </nav>
        </div>

        {/* Legal */}
        <div className="space-y-4">
          <h3 className="text-sm font-[800] uppercase tracking-widest text-[#E8720C]" style={{ fontFamily: 'var(--font-nunito-var)' }}>
            Support
          </h3>
          <nav className="flex flex-col gap-2">
            <Link href="/terms" className="text-sm text-[#E5E7EB] hover:text-[#E8720C] transition-colors">Terms &amp; Conditions</Link>
            <Link href="/privacy-policy" className="text-sm text-[#E5E7EB] hover:text-[#E8720C] transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-[#E5E7EB] hover:text-[#E8720C] transition-colors">Contact</Link>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-[#2A5298] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-[#9CA3AF]">
          &copy; {currentYear} Parikshanam. All rights reserved.
        </p>
        <div className="flex gap-6">
          {/* Placeholder Socials */}
          <span className="text-xs text-[#9CA3AF]">Twitter</span>
          <span className="text-xs text-[#9CA3AF]">Instagram</span>
          <span className="text-xs text-[#9CA3AF]">LinkedIn</span>
        </div>
      </div>
    </footer>
  );
}

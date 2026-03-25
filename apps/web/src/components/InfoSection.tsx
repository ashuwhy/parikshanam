import { Calculator, FlaskConical, Globe, Laptop, User } from 'lucide-react';

const SUBJECTS = [
  { Icon: Calculator, label: 'Math' },
  { Icon: FlaskConical, label: 'Science' },
  { Icon: Globe, label: 'Geography' },
  { Icon: Laptop, label: 'Computing' },
];

export default function InfoSection() {
  return (
    <section className="w-full py-20 px-6 bg-white border-t border-[#E5E0D8]">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-[900] text-[#1B3A6E] mb-4" style={{ fontFamily: 'var(--font-nunito-var)' }}>
            One Platform, Endless Subjects
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl" style={{ fontFamily: 'var(--font-roboto-var)' }}>
            We provide specialized Olympiad coaching and school curriculum support 
            tailored for students in Grades 6–10.
          </p>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full mb-20">
          {SUBJECTS.map(({ Icon, label }) => (
            <div 
              key={label}
              className="group flex flex-col items-center justify-center p-8 rounded-[2rem] bg-[#F9F7F5] border border-[#E5E0D8] transition-all hover:translate-y-[-4px] hover:border-[#E8720C] hover:bg-white"
            >
              <div className="p-4 rounded-2xl bg-white border-b-4 border-[#E5E0D8] group-hover:border-[#E8720C] mb-4 transition-colors">
                <Icon size={32} className="text-[#1B8A7A]" strokeWidth={2.5} />
              </div>
              <p className="text-sm font-[800] uppercase tracking-widest text-[#1B3A6E]" style={{ fontFamily: 'var(--font-nunito-var)' }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Social Proof / Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="p-8 rounded-[2rem] border border-[#E5E0D8] bg-[#F9F7F5] flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="w-12 h-12 rounded-full border-4 border-white bg-[#E8720C] flex items-center justify-center overflow-hidden"
                >
                  <User size={20} className="text-white" strokeWidth={2.5} />
                </div>
              ))}
            </div>
            <div>
              <p className="text-2xl font-[900] text-[#E8720C]" style={{ fontFamily: 'var(--font-nunito-var)' }}>
                10,000+
              </p>
              <p className="text-sm text-[#6B7280] font-medium" style={{ fontFamily: 'var(--font-roboto-var)' }}>
                Active students learning daily
              </p>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] border border-[#E5E0D8] bg-[#F9F7F5] flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-[#1B8A7A] flex items-center justify-center shrink-0">
               <Globe size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-2xl font-[900] text-[#1B3A6E]" style={{ fontFamily: 'var(--font-nunito-var)' }}>
                Pan-India
              </p>
              <p className="text-sm text-[#6B7280] font-medium" style={{ fontFamily: 'var(--font-roboto-var)' }}>
                Comprehensive coverage of all major boards
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

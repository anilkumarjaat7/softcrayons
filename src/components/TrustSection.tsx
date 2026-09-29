import { Users, BookOpen, Award, Globe } from 'lucide-react';
import { CountUpNumber } from './CountUpNumber';

const stats = [
  {
    icon: Users,
    value: '10,000+',
    label: 'Students Trained',
  },
  {
    icon: BookOpen,
    value: '20+',
    label: 'Courses Available',
  },
  {
    icon: Award,
    value: '90%',
    label: 'Success Rate',
  },
  {
    icon: Globe,
    value: '200+',
    label: 'Partner Companies',
  },
];

export function TrustSection() {
  return (
    <section className="border-y border-white/10 bg-[hsl(var(--brand-navy))] py-20 text-white">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center group animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-white/10 mb-4 group-hover:bg-secondary group-hover:scale-105 transition-all duration-300">
                <stat.icon className="w-7 h-7 text-secondary group-hover:text-white transition-colors" />
              </div>
              <CountUpNumber
                value={stat.value}
                className="text-3xl sm:text-4xl font-black text-white mb-1"
              />
              <div className="text-sm text-white/65 font-bold uppercase tracking-[0.12em]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

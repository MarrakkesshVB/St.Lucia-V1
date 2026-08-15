import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'motion/react';
import {
  Ship, MapPin, Flag, ArrowRight, Warehouse, Plane, Menu,
  Package, ShieldCheck, Phone, Star, ClipboardEdit, Box, MapPinned, CheckCircle2, Mail
} from 'lucide-react';

const AnimatedCounter = ({ value, suffix = "" }: { value: number, suffix?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      if (shouldReduceMotion) {
        setCount(value);
        return;
      }
      let startTimestamp: number | null = null;
      const duration = 2000;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeProgress * value));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, value, shouldReduceMotion]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function App() {
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const yBg = useTransform(scrollY, [0, 1000], [0, shouldReduceMotion ? 0 : 300]);

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [cargoType, setCargoType] = useState('Standard Container');
  const [weight, setWeight] = useState('');

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("Quote Request");
    const bodyText = `Origin: ${origin}\nDestination: ${destination}\nType: ${cargoType}\nWeight: ${weight} kg`;
    const body = encodeURIComponent(bodyText);
    window.location.href = `mailto:ingrid@stluciaexpress.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-[#0A101D] font-sans text-slate-300 selection:bg-[#ffb89e] selection:text-[#0A101D] overflow-x-hidden">
      
      {/* --- Navigation --- */}
      <nav className="absolute top-0 w-full z-50 px-6 lg:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ship className="text-[#ffb89e]" size={24} />
            <span className="font-semibold text-xl text-[#ffb89e] tracking-wide">
              St. Lucia Express
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8 text-slate-300 font-medium">
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
              <a href="#locations" className="hover:text-white transition-colors">Locations</a>
            </div>
            <a href="tel:+13054184151" className="bg-[#ffb89e] text-[#0A101D] px-6 py-2.5 rounded font-semibold text-sm hover:bg-[#ffb89e]/90 transition-colors flex items-center gap-2 shadow-lg shadow-[#ffb89e]/20">
              <Phone size={16} /> (305) 418-4151
            </a>
          </div>
          <button className="lg:hidden text-slate-300 hover:text-white">
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-[95vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            style={{ y: yBg, backgroundImage: 'url(https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop)' }}
            className="absolute -inset-[100px] bg-cover bg-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A101D] via-[#0A101D]/80 to-[#0A101D]/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-[#0A101D]/60 lg:bg-[#0A101D]/40"></div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <Reveal>
            <div className="max-w-xl hidden lg:block">
              <div className="flex flex-wrap gap-4 text-xs font-bold tracking-widest text-slate-300 uppercase mb-8">
                <div className="px-3 py-1 rounded border border-slate-700 bg-slate-900/50 flex items-center gap-2 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffb89e]"></span>
                  +20 Years Exp.
                </div>
                <div className="px-3 py-1 rounded border border-slate-700 bg-slate-900/50 flex items-center gap-2 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  Fully Licensed
                </div>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                Precision Maritime <br />
                <span className="text-[#ffb89e]">Logistics & Handling</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                Delivering secure, high-capacity cargo solutions from Miami to St. Lucia. Track, manage, and optimize your global supply chain with our trusted infrastructure.
              </p>
              <a href="tel:+13054184151" className="inline-flex items-center gap-3 text-xl text-white font-semibold hover:text-[#ffb89e] transition-colors group">
                <div className="bg-[#121C2D] p-3 rounded-full border border-slate-700 group-hover:border-[#ffb89e] transition-colors">
                  <Phone size={24} className="text-[#ffb89e]" />
                </div>
                +1 (305) 418-4151
              </a>
            </div>
            
            <div className="lg:hidden text-center mt-8 mb-4">
              <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
                Request a Quote
              </h1>
              <p className="text-base text-slate-300 mb-6">
                Fast, secure maritime logistics to St. Lucia.
              </p>
              <a href="tel:+13054184151" className="inline-flex items-center gap-2 text-lg text-white font-semibold mb-2">
                <Phone size={18} className="text-[#ffb89e]" /> +1 (305) 418-4151
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="lg:ml-auto w-full max-w-lg">
            <div className="bg-[#121C2D]/85 border border-slate-700/50 p-6 lg:p-8 rounded-xl backdrop-blur-md shadow-2xl">
              <h2 className="text-xl lg:text-2xl text-white font-semibold mb-8">Quick Quote Estimate</h2>
              <form onSubmit={handleQuoteSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 tracking-wider mb-2 uppercase">Origin Port / City</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="text" required value={origin} onChange={(e)=>setOrigin(e.target.value)} placeholder="e.g., Miami, FL" className="w-full bg-[#0A101D] border border-slate-700 rounded-md py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#ffb89e] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 tracking-wider mb-2 uppercase">Destination</label>
                  <div className="relative">
                    <Flag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="text" required value={destination} onChange={(e)=>setDestination(e.target.value)} placeholder="e.g., Castries, St. Lucia" className="w-full bg-[#0A101D] border border-slate-700 rounded-md py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#ffb89e] transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 tracking-wider mb-2 uppercase">Cargo Type</label>
                    <select value={cargoType} onChange={(e)=>setCargoType(e.target.value)} className="w-full bg-[#0A101D] border border-slate-700 rounded-md py-3 px-4 text-white appearance-none focus:outline-none focus:border-[#ffb89e] transition-colors">
                      <option>Standard Container</option>
                      <option>FCL (Full Container)</option>
                      <option>LCL (Less than Load)</option>
                      <option>Small Package</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 tracking-wider mb-2 uppercase">Weight (KG)</label>
                    <input type="number" required value={weight} onChange={(e)=>setWeight(e.target.value)} placeholder="0" className="w-full bg-[#0A101D] border border-slate-700 rounded-md py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#ffb89e] transition-colors" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#ffb89e] text-[#0A101D] font-bold py-3.5 rounded-md flex items-center justify-center gap-2 hover:bg-[#ffb89e]/90 transition-colors mt-4">
                  Request Rate <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- Trust Section --- */}
      <section className="bg-[#121C2D] border-y border-slate-800/60 py-12 px-6 lg:px-12 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center justify-between">
          <Reveal className="flex-1 w-full">
            <h3 className="text-slate-400 font-semibold uppercase tracking-widest text-xs mb-5 text-center lg:text-left">Licensed & Certified Operations</h3>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {['IAC', 'TSA', 'IATA', 'FMA', 'NVOCC'].map(license => (
                <div key={license} className="px-4 py-2 rounded-full border border-slate-700 bg-[#0A101D]/50 text-slate-300 font-medium text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-teal-500" />
                  {license}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2} className="flex gap-10 lg:gap-16">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2"><AnimatedCounter value={20} suffix="+" /></div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">Years Exp.</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2"><AnimatedCounter value={28} suffix="k" /></div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">Sq Ft Space</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- Capabilities / Services Section --- */}
      <section id="services" className="bg-[#0A101D] py-24 px-6 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Core Services</h2>
                <p className="text-slate-400 max-w-xl text-lg leading-relaxed">
                  Comprehensive logistics infrastructure designed for scale, speed, and security between the USA and St. Lucia.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {[
              { icon: Plane, title: "Air & Ocean Shipping", desc: "High-volume container shipping and time-critical air freight connecting Miami and St. Lucia seamlessly." },
              { icon: Warehouse, title: "Warehouse (28,000 sq ft)", desc: "Massive, highly-secure storage facility in Miami providing consolidation and climate-controlled holding." },
              { icon: Package, title: "Small Packages", desc: "Optimized handling for individual parcels and LCL shipments, ensuring fast delivery for every box." },
              { icon: ShieldCheck, title: "Cargo Insurance", desc: "Comprehensive coverage options giving you complete peace of mind from pickup to final destination." },
            ].map((srv, i) => (
              <Reveal key={srv.title} delay={i * 0.1}>
                <div className="bg-[#121C2D] p-8 lg:p-10 rounded-xl border border-slate-800/50 hover:border-slate-700 hover:bg-[#152033] transition-all h-full group">
                  <srv.icon className="text-[#ffb89e] mb-8 group-hover:scale-110 transition-transform duration-500" size={40} strokeWidth={1.5} />
                  <h3 className="text-xl font-bold text-white mb-4">{srv.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{srv.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section id="how-it-works" className="bg-[#121C2D] py-24 px-6 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-5">How It Works</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">A streamlined process ensuring your cargo arrives safely and on time.</p>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[48px] left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            {[
              { icon: ClipboardEdit, step: "01", title: "Request Quote", desc: "Provide your shipment details online or over the phone for an accurate estimate." },
              { icon: Box, step: "02", title: "Drop-off or Pickup", desc: "Bring your cargo to our 28,000 sq ft Miami facility or schedule a pickup." },
              { icon: MapPinned, step: "03", title: "Fast Delivery", desc: "Track your shipment until it arrives safely in Castries or Vieux Fort." },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 0.15} className="relative text-center">
                <div className="w-24 h-24 mx-auto bg-[#0A101D] border border-slate-700 rounded-full flex items-center justify-center mb-8 relative z-10 shadow-xl">
                  <item.icon className="text-[#ffb89e]" size={32} />
                  <div className="absolute -top-1 -right-1 bg-teal-500 text-[#0A101D] text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#121C2D]">{item.step}</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section className="bg-[#0A101D] py-24 px-6 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-16 text-center">Trusted by Thousands</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sakinah M.", review: "I've been using St. Lucia Express for years. They are incredibly reliable and their Miami facility is top-notch. Highly recommended for ocean shipping." },
              { name: "Michael J.", review: "Fast, secure, and professional. The team handles our small packages and large cargo with the same level of care. Best logistics company to Castries." },
              { name: "Jeanette F.", review: "Excellent customer service from start to finish. Having my cargo insured and tracked gives me complete peace of mind. Truly a 5-star experience." },
            ].map((test, i) => (
              <Reveal key={test.name} delay={i * 0.1} className="bg-[#121C2D]/80 backdrop-blur-sm p-8 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => <Star key={j} size={16} className="fill-teal-500 text-teal-500" />)}
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-8 italic">"{test.review}"</p>
                </div>
                <div className="flex items-center gap-4 border-t border-slate-800/80 pt-6">
                  <div className="w-10 h-10 rounded-full bg-[#0A101D] flex items-center justify-center border border-slate-700">
                    <span className="text-[#ffb89e] font-bold">{test.name.charAt(0)}</span>
                  </div>
                  <span className="font-semibold text-white">{test.name}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- Locations Section --- */}
      <section id="locations" className="bg-[#121C2D] py-24 px-6 lg:px-12 relative z-10 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-16 text-center">Our Locations</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Reveal delay={0}>
              <div className="bg-[#0A101D] p-10 lg:p-12 rounded-xl border border-slate-700 flex flex-col items-center text-center group hover:border-[#ffb89e]/50 transition-colors">
                <MapPin className="text-teal-500 mb-6 group-hover:-translate-y-2 transition-transform duration-300" size={40} />
                <h3 className="text-2xl font-bold text-white mb-3">Miami, USA</h3>
                <p className="text-slate-400 text-lg mb-8">11450 NW 34th St<br/>Doral, FL 33178</p>
                <div className="text-xs font-bold tracking-widest text-[#ffb89e] uppercase bg-[#ffb89e]/10 px-4 py-2 rounded-full">Headquarters & Warehouse</div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="bg-[#0A101D] p-10 lg:p-12 rounded-xl border border-slate-700 flex flex-col items-center text-center group hover:border-[#ffb89e]/50 transition-colors">
                <MapPin className="text-teal-500 mb-6 group-hover:-translate-y-2 transition-transform duration-300" size={40} />
                <h3 className="text-2xl font-bold text-white mb-3">St. Lucia</h3>
                <p className="text-slate-400 text-lg mb-8">Port Castries<br/>Vieux Fort</p>
                <div className="text-xs font-bold tracking-widest text-[#ffb89e] uppercase bg-[#ffb89e]/10 px-4 py-2 rounded-full">Destination Terminals</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- Final CTA --- */}
      <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-[#0A101D] to-[#121C2D] border-t border-slate-800/60 relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Ship?</h2>
            <p className="text-xl text-slate-400 mb-10">Get in touch with our team today and experience seamless logistics to St. Lucia.</p>
            <a href="tel:+13054184151" className="inline-flex items-center gap-3 bg-[#ffb89e] text-[#0A101D] px-8 py-4 rounded-md font-bold text-lg hover:bg-white transition-colors shadow-xl shadow-[#ffb89e]/10">
              <Phone size={20} /> (305) 418-4151
            </a>
          </Reveal>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#0A101D] border-t border-slate-800/60 pt-16 pb-12 px-6 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          <div className="md:col-span-2 lg:pr-12">
            <div className="flex items-center gap-3 mb-6">
              <Ship className="text-[#ffb89e]" size={24} />
              <span className="font-semibold text-xl text-[#ffb89e] tracking-wide">
                St. Lucia Express
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-sm">
              Engineered logistics solutions for a connected world. Licensed, insured, and trusted for over 20 years.
            </p>
            <div className="flex flex-col gap-3">
              <a href="tel:+13054184151" className="inline-flex items-center gap-3 text-slate-300 hover:text-[#ffb89e] transition-colors text-sm font-medium">
                <Phone size={18} /> +1 (305) 418-4151
              </a>
              <a href="mailto:ingrid@stluciaexpress.com" className="inline-flex items-center gap-3 text-slate-300 hover:text-[#ffb89e] transition-colors text-sm font-medium">
                <Mail size={18} /> ingrid@stluciaexpress.com
              </a>
            </div>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-6">Miami</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li>11450 NW 34th St<br/>Doral, FL 33178</li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-6">St. Lucia</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li>Port Castries</li>
              <li>Vieux Fort</li>
            </ul>
          </div>

        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800/60 text-slate-500 text-xs flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <p>© {new Date().getFullYear()} St. Lucia Express Logistics. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

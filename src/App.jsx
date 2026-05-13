import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import LiveDemo from './components/LiveDemo.jsx';
import Features from './components/Features.jsx';
import TechStack from './components/TechStack.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Results from './components/Results.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <Navbar />
      <main className="pt-20">
        <section id="home" className="section-padding">
          <div className="container-page">
            <Hero />
          </div>
        </section>

        <section id="demo" className="section-padding bg-slate-950/40 border-y border-slate-800/70">
          <div className="container-page">
            <LiveDemo />
          </div>
        </section>

        <section id="features" className="section-padding">
          <div className="container-page">
            <Features />
          </div>
        </section>

        <section id="tech" className="section-padding bg-slate-950/40 border-y border-slate-800/70">
          <div className="container-page">
            <TechStack />
          </div>
        </section>

        <section id="how-it-works" className="section-padding">
          <div className="container-page">
            <HowItWorks />
          </div>
        </section>

        <section id="results" className="section-padding bg-slate-950/40 border-y border-slate-800/70">
          <div className="container-page">
            <Results />
          </div>
        </section>

        <section id="contact" className="section-padding">
          <div className="container-page">
            <Contact />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;


import Navbar from "./components/Navbar";
import LandingHero from "./components/LandingHero";
import WhatYouGetGrid from "./components/WhatYouGetGrid";
import WorkflowSection from "./components/WorkflowSection";
import RepeatPracticeBanner from "./components/RepeatPracticeBanner";
import FAQAccordion from "./components/FAQAccordion";
import MinimalFooter from "./components/MinimalFooter";

function App() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Navigation Bar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section (Canvas Sequence Integrated) */}
        <LandingHero />

        {/* "What You Get" Grid */}
        <WhatYouGetGrid />

        {/* Workflow Section (Step-by-Step Timeline 01-03) */}
        <WorkflowSection />

        {/* "Built for Repeat Practice" Banner */}
        <RepeatPracticeBanner />

        {/* FAQ Accordion Section */}
        <FAQAccordion />
      </main>

      {/* Minimal Footer */}
      <MinimalFooter />
    </div>
  );
}

export default App;

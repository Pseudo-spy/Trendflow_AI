import React, { useState } from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { LandingHeader } from '../components/layout/LandingHeader';
import { HeroSection } from '../components/landing/HeroSection';
import { PipelineFlowSection } from '../components/landing/PipelineFlowSection';
import { CapabilitiesSection } from '../components/landing/CapabilitiesSection';
import { ProcurementVisualSection } from '../components/landing/ProcurementVisualSection';
import { ControlTowerTeaser } from '../components/landing/ControlTowerTeaser';
import { BusinessStatsSection } from '../components/landing/BusinessStatsSection';
import { WhyUsSection } from '../components/landing/WhyUsSection';
import { ScenarioTeaser } from '../components/landing/ScenarioTeaser';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';
import { LandingFooter } from '../components/landing/LandingFooter';
import { RequestAccessModal } from '../components/landing/RequestAccessModal';

export const LandingPage: React.FC = () => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  return (
    <PageTransitionLayout>
      {/* Top Landing Navigation Bar */}
      <div style={{ marginBottom: '24px' }}>
        <LandingHeader onRequestAccess={() => setIsRequestModalOpen(true)} />
      </div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
        {/* 1. Hero with Headline, CTAs, 3D Realism */}
        <div id="platform">
          <HeroSection />
        </div>

        {/* 2. End-to-End Realistic Supply Chain Flow */}
        <PipelineFlowSection />

        {/* 3. Procurement Visualization */}
        <ProcurementVisualSection />

        {/* 4. Core Platform Capabilities & Cards */}
        <div id="capabilities">
          <CapabilitiesSection />
        </div>

        {/* 5. Live Spatial Control Tower Preview Image */}
        <ControlTowerTeaser />
      </div>

      {/* 6. Realistic Enterprise Statistics (Full Width Background) */}
      <BusinessStatsSection />

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
        {/* 7. Why Us (Replacing generic problems with benefits) */}
        <WhyUsSection />

        {/* 8. What-If Scenario Flow */}
        <ScenarioTeaser />

        {/* 9. High-Impact Closing Enterprise CTA Banner */}
        <FinalCtaSection />
      </div>

      {/* 10. Enterprise Footer */}
      <LandingFooter />

      {/* Request Access Pilot Modal */}
      <RequestAccessModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </PageTransitionLayout>
  );
};

export default LandingPage;

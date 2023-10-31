import { Books } from '@/components/ui/site/Books';
import { Feedbacks } from '@/components/ui/site/Feedbacks';
import { Footer } from '@/components/ui/site/Footer';
import { Header } from '@/components/ui/site/Header';
import { Hero } from '@/components/ui/site/Hero';
import { HoWeAre } from '@/components/ui/site/HoWeAre';
import { OurProjects } from '@/components/ui/site/OurProjects';

const Index = () => {
  return (
    <div>
      <Header />
      <Hero />
      <HoWeAre />
      <OurProjects />
      <Feedbacks />
      <Books />
      <Footer />
    </div>
  );
};

export default Index;

import { LandingHero } from "@/components/landingHero";
import { LandingNavbar } from "@/components/landingNavbar";
import { LandingContent } from "@/components/landingContent";

export default function Home() {
  return (
    <div className="h-full">
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
    </div>
  )
}

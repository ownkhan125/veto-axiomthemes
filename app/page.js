import SmoothScroll from "./components/SmoothScroll";
import Cursor from "./components/Cursor";
import Grain from "./components/Grain";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Strip from "./components/Strip";
import Marquee from "./components/Marquee";
import Issues from "./components/Issues";
import Manifesto from "./components/Manifesto";
import Volunteer from "./components/Volunteer";
import Priorities from "./components/Priorities";
import Endorsements from "./components/Endorsements";
import Metrics from "./components/Metrics";
import GetInvolved from "./components/GetInvolved";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Reveal />
      <Cursor />
      <Grain />
      <Preloader />

      <Nav />

      <main id="top">
        <Hero />
        {/* <Strip /> */}
        <Marquee
          items={[
            "Healthcare",
            "Housing",
            "Climate action",
            "Public education",
            "Election integrity",
            "Working families",
          ]}
        />
        <Issues />
        <Marquee
          variant="dark"
          items={[
            "Join the movement",
            "Join the movement",
            "Join the movement",
            "Join the movement",
          ]}
        />
        <Manifesto />
        <Volunteer />
        <Priorities />
        <Endorsements />
        <Metrics />
        <GetInvolved />
      </main>

      <Footer />
    </>
  );
}

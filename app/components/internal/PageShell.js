'use client';

import SmoothScroll from '../SmoothScroll';
import Reveal from '../Reveal';
import Cursor from '../Cursor';
import Grain from '../Grain';
import Nav from '../Nav';
import Footer from '../Footer';

export default function PageShell({ children }) {
  return (
    <>
      <SmoothScroll />
      <Reveal />
      <Cursor />
      <Grain />
      <Nav />
      <main id="top">{children}</main>
      <Footer />
    </>
  );
}

import PageShell from '../components/internal/PageShell';
import PageHero from '../components/internal/PageHero';
import SectionDivider from '../components/internal/SectionDivider';

export const metadata = {
  title: 'Terms — Veto · Reyna for Nevada',
  description:
    'Terms of use for the Reyna for Nevada campaign website, including acceptable use, content ownership, and disclaimers.',
};

export default function TermsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Legal"
        title="Terms of use."
        caption="Plain-language terms covering use of this website, the volunteer system, and any content shared with the campaign."
      />

      <SectionDivider tone="light" align="left" />

      <section className="legal-page">
        <div className="legal-page__inner">
          <div className="legal-page__block">
            <h2>Acceptable use</h2>
            <p>
              You agree to use this site for lawful, non-commercial purposes related to the campaign. Do not attempt to
              disrupt the service, scrape personal information, impersonate volunteers or staff, or submit content that is
              false, threatening, or unlawful.
            </p>
          </div>

          <div className="legal-page__block">
            <h2>Content you submit</h2>
            <p>
              When you submit a question, message, or volunteer note, you grant the campaign a non-exclusive license to
              use that content in published responses, training materials, or campaign communications. We do not publish
              your name, email, or contact information without explicit consent.
            </p>
          </div>

          <div className="legal-page__block">
            <h2>Campaign content</h2>
            <p>
              All site copy, images, and design are the property of Reyna for Nevada or used with permission. You may
              quote and share campaign content for non-commercial, editorial, or organizing purposes with attribution.
            </p>
          </div>

          <div className="legal-page__block">
            <h2>Donations &amp; compliance</h2>
            <p>
              Contributions are subject to FEC limits and reporting requirements. The campaign discloses every donor over
              $200 and does not accept corporate PAC contributions. By contributing, you certify that the funds are your
              own and not from a prohibited source.
            </p>
          </div>

          <div className="legal-page__block">
            <h2>Disclaimers</h2>
            <p>
              The site is provided as-is. We make reasonable efforts to keep schedules, addresses, and event details
              current, but cannot guarantee accuracy in real time. Always confirm event details on the day of via email
              or text from the field team.
            </p>
          </div>

          <p className="legal-page__small">
            Paid for by Reyna for Nevada. Not authorized by any candidate or candidate's committee. Last updated: 2026.
          </p>
        </div>
      </section>
    </PageShell>
  );
}

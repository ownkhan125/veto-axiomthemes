import PageShell from '../components/internal/PageShell';
import PageHero from '../components/internal/PageHero';
import SectionDivider from '../components/internal/SectionDivider';

export const metadata = {
  title: 'Privacy — Veto · Reyna for Nevada',
  description:
    'How the campaign handles personal information collected through the website, volunteer signups, RSVPs, and contact forms.',
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Legal"
        title="Privacy."
        caption="A short, plain-language summary of how this campaign handles the personal information you share with us."
      />

      <SectionDivider tone="light" align="left" />

      <section className="legal-page">
        <div className="legal-page__inner">
          <div className="legal-page__block">
            <h2>What we collect</h2>
            <p>
              When you sign up to volunteer, RSVP to an event, submit a question, or contact the campaign, we collect the
              information you give us — name, email, phone (optional), ZIP code, city, and any details you choose to add.
              We do not run third-party advertising trackers on this site.
            </p>
          </div>

          <div className="legal-page__block">
            <h2>How we use it</h2>
            <p>
              Volunteer and supporter information is used by the campaign field team to coordinate shifts, route questions
              to regional leads, and send occasional updates. RSVP data is used to plan venue capacity. Contact-form
              messages are routed to the appropriate human within one business day.
            </p>
          </div>

          <div className="legal-page__block">
            <h2>What we never do</h2>
            <p>
              We do not sell, rent, or trade your personal information. We do not share it with corporate PACs or
              third-party advertisers. We do not enroll you in any list you didn't explicitly opt into.
            </p>
          </div>

          <div className="legal-page__block">
            <h2>Your rights</h2>
            <p>
              You can ask the campaign at any time to update, export, or delete your information. Reach the campaign at
              <a href="mailto:hello@vetocampaign.org"> hello@vetocampaign.org</a> and we will respond within seven days.
            </p>
          </div>

          <div className="legal-page__block">
            <h2>Cookies</h2>
            <p>
              This site uses only first-party functional cookies required to deliver the page. No advertising cookies, no
              cross-site trackers, no fingerprinting.
            </p>
          </div>

          <p className="legal-page__small">
            Last updated: 2026. This policy may be updated as the campaign grows. Material changes will be flagged on this
            page.
          </p>
        </div>
      </section>
    </PageShell>
  );
}

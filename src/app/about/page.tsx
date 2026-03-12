export const metadata = {
  title: "About",
  description: "About USCISTracker — a community tool for tracking USCIS case processing.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">About USCISTracker</h1>

      <div className="prose prose-neutral max-w-none space-y-6">
        <p className="text-muted-foreground">
          USCISTracker is a community tool that provides data insights into USCIS case processing
          status. We track daily updates across multiple form types and service centers to help
          applicants understand where their case stands in the processing timeline.
        </p>

        <h2 className="text-xl font-semibold mt-8" id="features">What We Track</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Case status lookups for individual receipt numbers</li>
          <li>Backlog snapshots showing case distribution by status</li>
          <li>Approval distribution across receipt blocks and months</li>
          <li>Recently approved cases for each form type and service center</li>
          <li>Status update distribution showing active processing</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">Supported Forms</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>I-485 — Application to Register Permanent Residence or Adjust Status</li>
          <li>I-765 — Application for Employment Authorization</li>
          <li>I-140 — Immigrant Petition for Alien Workers</li>
          <li>I-130 — Petition for Alien Relative</li>
          <li>I-131 — Application for Travel Document</li>
          <li>I-751 — Petition to Remove Conditions on Residence</li>
          <li>I-129F — Petition for Alien Fiancé(e)</li>
          <li>N-400 — Application for Naturalization</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">Data Source</h2>
        <p className="text-muted-foreground">
          All data is sourced from the official USCIS Case Status API available through the USCIS
          developer portal. We periodically query case statuses and aggregate the data to provide
          processing timeline analytics.
        </p>

        <h2 className="text-xl font-semibold mt-8" id="contact">Contact</h2>
        <p className="text-muted-foreground">
          For questions or feedback, please reach out via our community channels.
        </p>
      </div>
    </div>
  );
}

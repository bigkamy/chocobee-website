// Site-wide "under construction" notice pinned to the top of every public page.
// Single-line marquee scrolling right-to-left; the text is duplicated so the
// loop is seamless. Fixed one-line height (see --notice-h in globals.css) so the
// navbar and page content sit just below it.
const NOTICE =
  "We're currently working on improving our website. Some content and features may not be fully available. Thank you for your patience!";

export function SiteNoticeBand() {
  return (
    <div className="site-notice-band" role="status" aria-label={NOTICE}>
      <div className="site-notice-marquee">
        <span>{NOTICE}</span>
        <span aria-hidden="true">{NOTICE}</span>
      </div>
    </div>
  );
}

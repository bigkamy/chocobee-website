const trustItems = [
  {
    title: "Freshly Baked",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5c0-2.8 2.1-5.1 4.8-5.5.8-1.8 2.6-3 4.7-3A5.5 5.5 0 0 1 20 9.5c0 1.4-.5 2.6-1.3 3.6V20H6v-7.1c-.6-.1-1-.1-1-.4Z" />
        <path d="M8 15h8M8 18h8" />
      </svg>
    ),
  },
  {
    title: "Premium Ingredients",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3c4.5 2.7 6.8 6.4 6.8 10.2A6.8 6.8 0 0 1 5.2 13.2C5.2 9.4 7.5 5.7 12 3Z" />
        <path d="M9 13.2c1.5.8 3.9.8 6 0M10 16h4" />
      </svg>
    ),
  },
  {
    title: "Custom Designs",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 20 4.6-1.3L19.3 8a2.4 2.4 0 0 0-3.4-3.4L5.3 15.3 4 20Z" />
        <path d="m14 6 4 4M12 20h8" />
      </svg>
    ),
  },
  {
    title: "On-Time Delivery",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h11v10H4zM15 10h3.2l1.8 2.4V17h-5z" />
        <path d="M7.5 19a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM17.5 19a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM8 4v3M4 11h4" />
      </svg>
    ),
  },
  {
    title: "100% Satisfaction",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 2.8 2.1 3.5.1 1.1 3.3 2.2 2.7-1.1 3.3.1 3.5-3.3 1.1-2.7 2.2-3.3-1.1-3.5.1-1.1-3.3-2.2-2.7 1.1-3.3-.1-3.5 3.3-1.1Z" />
        <path d="m8.5 12.3 2.2 2.2 4.8-5" />
      </svg>
    ),
  },
];

export function TrustSection() {
  return (
    <section className="trust-section" aria-labelledby="trust-heading">
      <div className="trust-inner">
        <div className="trust-heading reveal">
          <p>Our Promise</p>
          <h2 id="trust-heading" className="font-heading">
            Every Order Gets the Chocobee Care
          </h2>
        </div>

        <div className="trust-grid">
          {trustItems.map((item, index) => (
            <article className={`trust-card trust-card-${index + 1} reveal`} key={item.title}>
              <span className="trust-icon">{item.icon}</span>
              <h3>{item.title}</h3>
            </article>
          ))}
        </div>

        <div className="reviews-cta reveal">
          <h3 className="font-heading">Ready to Create Your Dream Cake?</h3>
          <div>
            <a href="https://wa.me/" target="_blank" rel="noreferrer">
              Order on WhatsApp
            </a>
            <a href="#treats">View Cake Gallery</a>
          </div>
        </div>
      </div>
    </section>
  );
}

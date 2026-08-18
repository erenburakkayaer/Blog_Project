function PlaceholderPage({ eyebrow = "Uslukılıç Yazılım", title, description }) {
  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading">
          <span className="page-heading__eyebrow">{eyebrow}</span>

          <h1 className="page-heading__title">{title}</h1>

          <p className="page-heading__description">{description}</p>
        </div>

        <div className="surface-card p-4">
          <p className="mb-0 text-secondary">
            Bu sayfanın profesyonel arayüzü sonraki aşamada geliştirilecektir.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PlaceholderPage;

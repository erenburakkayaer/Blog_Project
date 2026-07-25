const statistics = [
  {
    title: "Toplam Blog",
    value: "24",
    icon: "bi-journal-text",
    change: "+4 bu ay",
  },
  {
    title: "Toplam Proje",
    value: "12",
    icon: "bi-folder2-open",
    change: "+2 bu ay",
  },
  {
    title: "Yeni Mesaj",
    value: "18",
    icon: "bi-envelope",
    change: "6 okunmamış",
  },
  {
    title: "Toplam Kullanıcı",
    value: "48",
    icon: "bi-people",
    change: "+8 bu ay",
  },
];

function DashboardPage() {
  return (
    <section>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h3 fw-bold mb-1">Dashboard</h2>
          <p className="text-secondary mb-0">
            Sistem durumunu ve son hareketleri buradan takip edin.
          </p>
        </div>

        <button className="btn btn-primary" type="button">
          <i className="bi bi-plus-lg me-2" />
          Yeni İçerik
        </button>
      </div>

      <div className="row g-4">
        {statistics.map((item) => (
          <div className="col-12 col-sm-6 col-xl-3" key={item.title}>
            <article className="dashboard-card">
              <div className="dashboard-card__icon">
                <i className={`bi ${item.icon}`} />
              </div>

              <div>
                <p className="text-secondary mb-1">{item.title}</p>
                <h3 className="h2 fw-bold mb-1">{item.value}</h3>
                <small className="text-success">{item.change}</small>
              </div>
            </article>
          </div>
        ))}
      </div>

      <div className="row g-4 mt-1">
        <div className="col-12 col-xl-8">
          <section className="dashboard-panel">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="h5 fw-bold mb-1">Son İçerikler</h3>
                <p className="text-secondary mb-0">
                  Yakın zamanda eklenen içerikler
                </p>
              </div>

              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
              >
                Tümünü Gör
              </button>
            </div>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Başlık</th>
                    <th>Tür</th>
                    <th>Durum</th>
                    <th>Tarih</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Yapay Zekâ Çözümleri</td>
                    <td>Blog</td>
                    <td>
                      <span className="badge text-bg-success">Yayında</span>
                    </td>
                    <td>25 Temmuz 2026</td>
                  </tr>

                  <tr>
                    <td>Kurumsal Web Projesi</td>
                    <td>Proje</td>
                    <td>
                      <span className="badge text-bg-warning">Taslak</span>
                    </td>
                    <td>24 Temmuz 2026</td>
                  </tr>

                  <tr>
                    <td>Siber Güvenlik Hizmeti</td>
                    <td>Hizmet</td>
                    <td>
                      <span className="badge text-bg-success">Yayında</span>
                    </td>
                    <td>22 Temmuz 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="col-12 col-xl-4">
          <section className="dashboard-panel">
            <h3 className="h5 fw-bold mb-4">Hızlı İşlemler</h3>

            <div className="d-grid gap-3">
              <button className="btn btn-outline-dark text-start" type="button">
                <i className="bi bi-file-earmark-plus me-2" />
                Yeni blog yazısı ekle
              </button>

              <button className="btn btn-outline-dark text-start" type="button">
                <i className="bi bi-folder-plus me-2" />
                Yeni proje ekle
              </button>

              <button className="btn btn-outline-dark text-start" type="button">
                <i className="bi bi-envelope-open me-2" />
                Mesajları görüntüle
              </button>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;

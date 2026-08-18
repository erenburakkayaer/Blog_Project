function DashboardSkeleton() {
  return (
    <div aria-label="Dashboard yükleniyor" aria-busy="true">
      <div className="row g-4">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="col-12 col-sm-6 col-xl-4" key={index}>
            <div className="dashboard-card h-100">
              <div className="dashboard-skeleton dashboard-skeleton--icon" />

              <div className="flex-grow-1">
                <div className="dashboard-skeleton dashboard-skeleton--text mb-2" />
                <div className="dashboard-skeleton dashboard-skeleton--value mb-2" />
                <div className="dashboard-skeleton dashboard-skeleton--small" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mt-1">
        <div className="col-12 col-xl-8">
          <div className="dashboard-panel">
            <div className="dashboard-skeleton dashboard-skeleton--heading mb-4" />

            {Array.from({ length: 5 }, (_, index) => (
              <div
                className="dashboard-skeleton dashboard-skeleton--row mb-3"
                key={index}
              />
            ))}
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="dashboard-panel">
            <div className="dashboard-skeleton dashboard-skeleton--heading mb-4" />

            {Array.from({ length: 5 }, (_, index) => (
              <div
                className="dashboard-skeleton dashboard-skeleton--button mb-3"
                key={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;

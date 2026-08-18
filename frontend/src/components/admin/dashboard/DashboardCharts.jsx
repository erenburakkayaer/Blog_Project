import PropTypes from "prop-types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_COLORS = ["#0d6efd", "#212529"];

function DashboardCharts({
  blogCount,
  projectCount,
  publishedCount,
  draftCount,
}) {
  const contentDistributionData = [
    {
      name: "Blog",
      value: blogCount,
    },
    {
      name: "Proje",
      value: projectCount,
    },
  ];

  const publicationStatusData = [
    {
      name: "Yayında",
      value: publishedCount,
    },
    {
      name: "Taslak",
      value: draftCount,
    },
  ];

  const totalContent = blogCount + projectCount;
  const totalStatus = publishedCount + draftCount;

  return (
    <div className="row g-4">
      <div className="col-12 col-xl-5">
        <section className="dashboard-panel h-100">
          <div className="mb-3">
            <h2 className="h5 fw-bold mb-1">İçerik Dağılımı</h2>

            <p className="text-secondary mb-0">
              Blog ve proje sayılarının karşılaştırması
            </p>
          </div>

          {totalContent === 0 ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center text-center"
              style={{ minHeight: "320px" }}
            >
              <i
                className="bi bi-pie-chart fs-1 text-secondary"
                aria-hidden="true"
              />

              <p className="text-secondary mt-3 mb-0">
                Grafik için henüz içerik bulunmuyor.
              </p>
            </div>
          ) : (
            <div style={{ width: "100%", height: "320px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentDistributionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={4}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {contentDistributionData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip formatter={(value) => [`${value} içerik`, "Sayı"]} />

                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      <div className="col-12 col-xl-7">
        <section className="dashboard-panel h-100">
          <div className="mb-3">
            <h2 className="h5 fw-bold mb-1">Yayın Durumu</h2>

            <p className="text-secondary mb-0">
              Yayındaki ve taslak içeriklerin karşılaştırması
            </p>
          </div>

          {totalStatus === 0 ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center text-center"
              style={{ minHeight: "320px" }}
            >
              <i
                className="bi bi-bar-chart fs-1 text-secondary"
                aria-hidden="true"
              />

              <p className="text-secondary mt-3 mb-0">
                Grafik için yayın durumu bulunmuyor.
              </p>
            </div>
          ) : (
            <div style={{ width: "100%", height: "320px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={publicationStatusData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis dataKey="name" tickLine={false} axisLine={false} />

                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip formatter={(value) => [`${value} içerik`, "Sayı"]} />

                  <Bar
                    dataKey="value"
                    name="İçerik"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={90}
                  >
                    {publicationStatusData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

DashboardCharts.propTypes = {
  blogCount: PropTypes.number,
  projectCount: PropTypes.number,
  publishedCount: PropTypes.number,
  draftCount: PropTypes.number,
};

DashboardCharts.defaultProps = {
  blogCount: 0,
  projectCount: 0,
  publishedCount: 0,
  draftCount: 0,
};

export default DashboardCharts;

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main className="min-vh-100 bg-dark">
      <div className="container-fluid min-vh-100">
        <div className="row min-vh-100">
          <section className="col-lg-6 d-none d-lg-flex align-items-center bg-black text-light p-5">
            <div className="mx-auto" style={{ maxWidth: "560px" }}>
              <a
                className="d-inline-flex align-items-center gap-2 text-light mb-5"
                href="/"
              >
                <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary p-3">
                  <i className="bi bi-code-slash fs-4" />
                </span>

                <span className="fs-3 fw-bold">TechNova</span>
              </a>

              <span className="badge rounded-pill bg-primary mb-4">
                Yönetim Platformu
              </span>

              <h1 className="display-5 fw-bold mb-4">
                Dijital içeriklerinizi tek merkezden yönetin.
              </h1>

              <p className="lead text-white-50 mb-0">
                Blog, proje, hizmet, kullanıcı ve sistem içeriklerini güvenli
                yönetim paneli üzerinden kontrol edin.
              </p>
            </div>
          </section>

          <section className="col-12 col-lg-6 d-flex align-items-center bg-light p-3 p-sm-4 p-lg-5">
            <div className="w-100 mx-auto" style={{ maxWidth: "480px" }}>
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;

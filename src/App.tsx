import { Suspense, lazy, useEffect, FC } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
  useLocation,
} from "react-router-dom";
import { Heart, Search } from "lucide-react";

const HomePage = lazy(() => import("./pages/HomePage"));
const GifDetailsPage = lazy(() => import("./pages/GifDetailsPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));

import { ToastProvider } from "./components/ToastContainer";

// Прокрутка на гору при зміні маршруту
const ScrollToTop: FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

const Navigation: FC = () => {
  const linkBase =
    "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const linkIdle = "text-gray-600 hover:text-pink-600 hover:bg-pink-50";
  const linkActive = "text-pink-700 bg-pink-100";

  return (
    <nav
      className="bg-white shadow-sm border-b sticky top-0 z-40"
      role="navigation"
      aria-label="Primary"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "text-blue-700 bg-blue-100" : "text-gray-900 hover:text-blue-600"}`
              }
              aria-label="Go to Search"
            >
              <Search size={24} className="text-blue-500" aria-hidden="true" />
              <span className="text-xl font-bold">GIF Web</span>
            </NavLink>
          </div>

          <div className="flex items-center gap-2">
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              {({ isActive }) => (
                <>
                  <Heart size={18} aria-hidden="true" />
                  <span className="hidden sm:inline">Favorites</span>
                  {isActive && (
                    <span className="sr-only" aria-current="page">
                      {" "}
                      (current)
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NotFound: FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        404 — Page Not Found
      </h1>
      <p className="text-gray-600 mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Search size={18} aria-hidden="true" />
        Back to Search
      </Link>
    </div>
  </div>
);

const App: FC = () => {
  return (
    <ToastProvider>
      <Router>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:text-blue-700 focus:p-2 focus:rounded focus:shadow"
        >
          Skip to content
        </a>

        <ScrollToTop />
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main id="main-content">
            <Suspense
              fallback={
                <div className="container mx-auto px-4 py-12">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 w-48 bg-gray-200 rounded" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-video bg-gray-200 rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/gif/:id" element={<GifDetailsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </ToastProvider>
  );
};

export default App;

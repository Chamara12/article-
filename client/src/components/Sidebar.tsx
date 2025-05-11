import { Link, useLocation } from "wouter";

interface SidebarProps {
  expanded: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ expanded, toggleSidebar }: SidebarProps) {
  const [location] = useLocation();

  return (
    <div
      className={`fixed top-0 left-0 h-full z-30 overflow-auto transition-transform duration-300 ${
        expanded ? "w-64 transform-none" : "w-64 -translate-x-60"
      } bg-background border-r border-gray-800`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-primary">SEO Generator</h1>
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-primary transition"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>

        <nav className="mt-6">
          <ul>
            <li className="mb-2">
              <Link
                href="/"
                className={`flex items-center px-4 py-3 rounded-md text-white transition ${
                  location === "/"
                    ? "bg-primary bg-opacity-20 hover:bg-opacity-30"
                    : "hover:bg-gray-800"
                }`}
              >
                <i className="fas fa-pen-to-square mr-3"></i>
                <span>New Article</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/history"
                className={`flex items-center px-4 py-3 rounded-md text-white transition ${
                  location === "/history"
                    ? "bg-primary bg-opacity-20 hover:bg-opacity-30"
                    : "hover:bg-gray-800"
                }`}
              >
                <i className="fas fa-history mr-3"></i>
                <span>Article History</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/admin"
                className={`flex items-center px-4 py-3 rounded-md text-white transition ${
                  location === "/admin"
                    ? "bg-primary bg-opacity-20 hover:bg-opacity-30"
                    : "hover:bg-gray-800"
                }`}
              >
                <i className="fas fa-gear mr-3"></i>
                <span>Admin Panel</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <div className="flex items-center text-sm text-muted-foreground">
          <i className="fas fa-info-circle mr-2"></i>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
}

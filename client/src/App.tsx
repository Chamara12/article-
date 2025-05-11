import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import Article from "@/pages/Article";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar expanded={sidebarExpanded} toggleSidebar={toggleSidebar} />
      
      {/* Toggle button when sidebar is collapsed */}
      <button 
        className={`fixed top-4 left-4 z-40 bg-background p-2 rounded-md text-white hover:text-primary transition ${sidebarExpanded ? 'opacity-0' : 'opacity-100'}`}
        onClick={toggleSidebar}
      >
        <i className="fas fa-bars"></i>
      </button>

      <div 
        className={`sidebar-transition flex-1 min-h-screen ${
          sidebarExpanded ? 'ml-64' : 'ml-6'
        }`}
      >
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/article/:id" component={Article} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

export default App;

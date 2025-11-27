import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { Navbar } from '../components/NavBar';
import { CreateContentModal } from '../components/ui/CreateContent';
import { Sidebar } from '../components/ui/Sidebar';

// Pages that should show sidebar
const SIDEBAR_PAGES = new Set(['/feed', '/dashboard', '/explore']);

export const MainLayout = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { refresh } = useContent();
  const location = useLocation();

  const showSidebar = SIDEBAR_PAGES.has(location.pathname);
  
  let marginLeft = '';
  if (showSidebar) {
    marginLeft = collapsed ? 'ml-20' : 'ml-64';
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {showSidebar && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
      
      <div className={`flex flex-1 flex-col transition-all duration-300 ${marginLeft}`}>
        <Navbar onAddContent={() => setModalOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      
      <CreateContentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        refreshContent={refresh}
      />
    </div>
  );
};
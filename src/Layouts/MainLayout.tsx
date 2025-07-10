import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { Navbar } from '../components/NavBar';
import { CreateContentModal } from '../components/ui/CreateContent';

export const MainLayout = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { refresh } = useContent(); 

  return (
    <div className="flex">
      <div className="flex flex-1 flex-col">
        <Navbar onAddContent={() => setModalOpen(true)} />
        <main className="p-6">
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
import { Outlet } from 'react-router-dom';
import Topbar from './components/Topbar';
import DashboardLayout from './components/DashboardLayout';

const Dashboard = () => {
  return (
    <>
      <Topbar />
      <div className="flex h-[calc(100dvh-48px)] justify-between bg-gray-400 dark:bg-black tablet:h-[calc(100dvh-96px)] laptop:h-[calc(100dvh-70px)]">
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </div>
    </>
  );
};

export default Dashboard;

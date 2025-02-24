import UserProfile from '.';
import DashboardLayout from '../Dashboard/components/DashboardLayout';
import Topbar from '../Dashboard/components/Topbar';

export default function PublicProfile() {
  return (
    <>
      <div className="w-full bg-[#F2F3F5] dark:bg-black">
        <Topbar />
        <DashboardLayout>
          <div className="mx-auto flex h-[calc(100dvh-91px)] w-full max-w-[1440px] overflow-y-auto py-2 no-scrollbar tablet:h-[calc(100vh-160px)] tablet:py-[15px] laptop:mx-[331px] laptop:h-[calc(100vh-70px)] laptop:px-4 desktop:mx-auto desktop:px-0">
            <UserProfile />
          </div>
        </DashboardLayout>
      </div>
    </>
  );
}

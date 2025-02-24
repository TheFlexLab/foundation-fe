import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

export default function FindOtherProfiles() {
  const navigate = useNavigate();
  return (
    <>
      {(location.pathname === '/profile' || location.pathname.startsWith('/h/')) && (
        <div className="my-2 hidden h-fit w-full rounded-[3.55px] tablet:mx-auto tablet:max-w-[778px] tablet:px-[30px] laptop:my-[15px] laptop:ml-[31px] laptop:block laptop:w-[18.75rem] laptop:min-w-[18.75rem] laptop:rounded-[15px] laptop:bg-white laptop:py-[23px] laptop:pl-[1.3rem] laptop:pr-[2.1rem] laptop:dark:bg-gray-200">
          <Button variant="cancel-full" onClick={() => navigate('/profile-others')}>
            Find other Profiles
          </Button>
        </div>
      )}
    </>
  );
}

import { Button } from './ui/Button';
import { useDispatch } from 'react-redux';
import { setOptionState } from '../features/quest/seeMoreOptionsSlice';

type Props = {
  id: string;
};

export default function SeeMoreOptions({ id }: Props) {
  const dispatch = useDispatch();

  const handleSeeMore = () => {
    dispatch(setOptionState({ id, isShow: true }));
  };

  return (
    <div className="absolute bottom-0 flex h-[54px] min-h-[54px] w-full items-center justify-center bg-gradient-to-b from-white/60 via-white/80 to-white dark:from-gray-200/60 dark:via-gray-200/80 dark:to-gray-200 tablet:h-[108px] tablet:min-h-[108px]">
      <Button
        variant="show-more-options"
        className="flex flex-col items-center gap-1"
        rounded={false}
        onClick={handleSeeMore}
      >
        <span>Show more options</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path
            d="M2 2L8 8.0649L14 2"
            stroke="#4A8DBD"
            strokeWidth="2.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </div>
  );
}

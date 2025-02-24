import { useLocation } from 'react-router-dom';

export default function EmbedParticipate({ postProperties }: { postProperties: string }) {
  const location = useLocation();
  const match = location.pathname.match(/\/embed\/([^\/]+)/);

  return (
    <>
      {postProperties === 'Embed' ? (
        <div className="absolute top-1/2 flex w-full -translate-y-1/2 justify-center">
          {match && (
            <a
              href={`${import.meta.env.VITE_FRONTEND_URL}/p/${match[1]}`}
              target="_blank"
              className="cursor-pointer text-[10px] font-normal leading-[121.4%] text-blue-100 underline dark:text-blue-600 tablet:text-[20px]"
            >
              Participate and earn 25 FDX
            </a>
          )}
        </div>
      ) : null}
    </>
  );
}

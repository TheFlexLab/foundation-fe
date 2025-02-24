import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const ListItem = ({ post, setCategoryId, categoryItem, setPostId, setDeletePostPopup }) => {
  const location = useLocation();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const notPublicProfile = !location.pathname.startsWith('/h/');

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: post._id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const imagePath =
    persistedTheme === 'dark'
      ? `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots-dark.svg`
      : `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots.svg`;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center tablet:gap-[10px]">
      <div
        className={`${
          isDragging ? 'border-blue-300' : 'border-white-500 bg-white dark:border-gray-100 dark:bg-accent-100'
        } flex w-full items-center rounded-[4.7px] border tablet:rounded-[10px] tablet:border-[3px]`}
      >
        <div className="flex w-full items-center rounded-[4.734px] bg-white-500 dark:bg-gray-100">
          <div
            className={`${
              isDragging ? 'border-blue-300' : 'border-white-500 dark:border-gray-250'
            } tablet:rounded-x-[10px] flex h-full w-3 items-center rounded-l-[4.734px] bg-contain bg-center bg-no-repeat px-[3.3px] py-[4.6px] tablet:w-[25px] tablet:px-[7px] tablet:py-[10px]`}
            style={{
              backgroundImage: `url(${notPublicProfile && imagePath})`,
            }}
          />
          <div
            className={`${
              isDragging ? 'border-blue-300 bg-[#F2F6FF] dark:bg-accent-100' : 'border-white-500 dark:border-gray-250'
            } flex w-full justify-between rounded-r-[4.7px] bg-white dark:bg-accent-100 tablet:rounded-r-[10px]`}
          >
            <h1 className="text-gray px-2 pb-[5.6px] pt-[5.6px] text-[8.52px] font-normal leading-[10px] outline-none dark:text-gray-300 tablet:py-3 tablet:pl-[18px] tablet:text-[19px] tablet:leading-[19px]">
              {post?.questForeginKey.Question}
            </h1>
          </div>
        </div>
      </div>
      {notPublicProfile && (
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/trash.svg' : 'assets/svgs/dashboard/trash2.svg'}`}
          alt="trash"
          className="ml-[11px] h-3 w-[9px] cursor-pointer tablet:h-[33px] tablet:w-[25px]"
          onClick={() => {
            setCategoryId(categoryItem._id), setPostId(post._id), setDeletePostPopup(true);
          }}
        />
      )}
    </div>
  );
};

export default ListItem;

import { useLocation } from 'react-router-dom';

const SingleAnswer = (props) => {
  const location = useLocation();
  const isDomainPage =
    location.pathname.startsWith('/h/') ||
    location.pathname.startsWith('/p/') ||
    location.pathname.startsWith('/l/') ||
    location.pathname === '/profile';

  return (
    <div
      className={`flex items-center ${props.questStartData.type === 'embed' ? 'px-7 tablet:px-[3.94rem]' : 'pl-7 pr-12 tablet:pl-[69px] tablet:pr-[6.3rem]'}`}
    >
      <div
        className={`relative flex w-full justify-between rounded-[5.387px] border border-white-500 bg-white dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[10px] tablet:border-[3px] ${props.btnText === 'Results' ? 'pointer-events-none' : 'cursor-pointer'} ${isDomainPage && props.ownerCheck && 'shadow-options-mobile tablet:shadow-options'}`}
        onClick={() =>
          props.btnText === 'Results'
            ? null
            : props.handleToggleCheck(
                props.questStartData.whichTypeQuestion,
                props.answer,
                !props.check,
                props.questStartData._id
              )
        }
      >
        {isDomainPage && props.ownerCheck && (
          <img
            src={props.profilePicture}
            alt="msgSends"
            className="absolute -left-[23px] top-1/2 size-[16px] -translate-y-1/2 transform rounded-full border-2 border-blue-100 object-cover tablet:-left-12 tablet:size-[36px]"
          />
        )}
        <div className="flex h-[21.8px] w-3 min-w-[12px] items-center justify-center rounded-l-[4px] bg-white-500 dark:bg-gray-100 tablet:h-[43px] tablet:w-5 tablet:min-w-5">
          &#x200B;
        </div>
        <div className="relative flex w-full items-center">
          {((props.isEmbedResults && props.postProperties === 'Embed') || props.postProperties !== 'Embed') && (
            <div
              className="absolute top-0 block h-[5px] bg-green-100 tablet:h-[10px]"
              style={{
                width: props.percentage,
              }}
            />
          )}
          <h1 className="pb-[5.7px] pl-2 pt-[5.6px] text-[8.52px] font-normal leading-none text-[#435059] dark:text-[#D3D3D3] tablet:py-3 tablet:pl-[18px] tablet:text-[19px]">
            {props.answer}
          </h1>
        </div>
        {props?.postProperties !== 'HiddenPosts' &&
          ((props.isEmbedResults && props.postProperties === 'Embed') || props.postProperties !== 'Embed') && (
            <div
              className={`flex items-center gap-[10.3px] pr-[10px] text-[9.2px] tablet:gap-[22px] tablet:text-[16px] ${
                props.btnText === 'Results' ? 'pointer-events-none' : ''
              }`}
            >
              <div className="flex items-center gap-1 laptop:gap-[18px]">
                {props?.questStartData?.type !== 'embed' &&
                  props?.postProperties !== 'sharedlink-results' &&
                  props.postProperties !== 'actual-results' && (
                    <div id="custom-checkbox" className="flex h-full items-center">
                      <input
                        id="small-checkbox"
                        type="checkbox"
                        className="checkbox h-[11.4px] w-[11.4px] rounded-full tablet:h-[25px] tablet:w-[25px]"
                        checked={props.check}
                        readOnly
                      />
                    </div>
                  )}
                {props.btnText === 'Results' ? (
                  props.percentage === undefined || props.percentage === null ? (
                    <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">0%</span>
                  ) : (
                    <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">{props.percentage}</span>
                  )
                ) : null}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default SingleAnswer;

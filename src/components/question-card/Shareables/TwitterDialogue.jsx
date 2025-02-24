import { useSelector } from 'react-redux';
import Close from '../../../assets/Close';
import Twitter from '../../../assets/Twitter';
import CardTopbar from '../CardTopbar';
import QuestBottombar from '../QuestBottombar';
import { Button } from '../../ui/Button';

const TwitterDialogue = ({ handleClose, createdBy, img, alt, badgeCount, title, question, timeAgo, id }) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const { protocol, host } = window.location;
  let url = `${protocol}//${host}/post/${id}`;

  return (
    <div className="relative w-[90vw] laptop:w-[52.6rem]">
      <div className="social-blue-gradiant relative flex items-center gap-[10px] rounded-t-[9.251px] px-[15px] py-1 tablet:gap-4 tablet:rounded-t-[26px] tablet:px-[30px] tablet:py-[8px]">
        <div className="w-fit rounded-full bg-black p-[5px] tablet:p-[15px]">
          <Twitter color="white" />
        </div>
        <p className="text-[12px] font-bold text-white tablet:text-[20px] tablet:font-medium">Twitter</p>
        <div
          className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer tablet:right-[26px]"
          onClick={handleClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 23 23"
            fill="none"
            className="h-[10px] w-[10px] tablet:h-[23px] tablet:w-[23px]"
          >
            <path
              d="M0.742781 4.71145C-0.210937 3.77788 -0.251625 2.22222 0.651895 1.23678C1.55542 0.251347 3.06101 0.209303 4.01472 1.14287L10.9221 7.9044L17.466 0.76724C18.3696 -0.218195 19.8751 -0.260239 20.8289 0.673332C21.7826 1.6069 21.8233 3.16257 20.9197 4.148L14.3759 11.2852L21.2833 18.0467C22.237 18.9803 22.2777 20.5359 21.3742 21.5213C20.4706 22.5068 18.9651 22.5488 18.0113 21.6153L11.1039 14.8537L4.56004 21.9909C3.65651 22.9763 2.15092 23.0184 1.19721 22.0848C0.243494 21.1512 0.202803 19.5956 1.10632 18.6101L7.65021 11.473L0.742781 4.71145Z"
              fill="#F3F3F3"
            />
          </svg>
        </div>
      </div>
      {/* <div className="px-6 py-[17px] tablet:pt-7 tablet:px-[27px] border-[0.728px] tablet:border-2 border-gray-250 mt-1">

        <div className="w-full rounded-[9.8px] tablet:rounded-[15px] border-[0.728px] tablet:border-2 border-gray-250">
          <CardTopbar badgeCount={5} QuestTopic="Technology" />
          <div className="pt-[12px] pb-4 tablet:pb-5 tablet:pt-[0.94rem]">
            <div className="ml-[1.39rem] mr-[0.62rem] tablet:ml-[3.25rem] tablet:mr-[1.3rem] laptop:ml-[3.67rem]">
              <h4 className="text-[7.26px] font-semibold text-gray-1 tablet:text-[1.25rem] leading-none">
                {question?.endsWith('?') ? 'Q.' : 'S.'} {question}
              </h4>
            </div>
          </div>
          <div className="my-2 tablet:my-[24px] pr-[10px] tablet:pr-[30px] flex w-full justify-end gap-[13px] tablet:gap-[42px]">
            <Button variant="start">Start</Button>
            <Button variant="result-outline">Result</Button>
          </div>
          <QuestBottombar time={timeAgo} img={'/assets/svgs/dashboard/badge.svg'} alt={'badge'} badgeCount={5} />
        </div>
      </div> */}
      {/* Share Buttons */}
      <div className="my-[15px] flex flex-col items-center justify-center gap-2 tablet:my-5 tablet:py-6 laptop:flex-row laptop:gap-[43px]">
        <a
          className="w-[212px] rounded-[5.56px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[9.4px] py-1 text-center text-[10px] font-semibold leading-normal text-white tablet:w-[341px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px] laptop:w-[212px]"
          href={`https://twitter.com/intent/tweet?text=${url}`}
          target="_blank"
        >
          Share This Post
        </a>
        <button className="w-[212px] rounded-[5.56px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[9.4px] py-1 text-[10px] font-semibold leading-normal text-white tablet:w-[341px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px]">
          Send in a Personal Message
        </button>
      </div>
    </div>
  );
};

export default TwitterDialogue;

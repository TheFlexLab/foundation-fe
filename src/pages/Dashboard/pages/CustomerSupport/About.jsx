import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setCredentialLogin,
  setCredentialRegister,
  setGuestSignUpDialogue,
} from '../../../../features/extras/extrasSlice';

const About = () => {
  const navigate = useNavigate();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <div className="bg-white dark:border-gray-100 dark:bg-gray-200 tablet:rounded-b-[0.86513rem] tablet:rounded-t-[0.86513rem] tablet:dark:border-[2.56px]">
      <div className="-mt-[2px] space-y-[0.63rem] bg-[#238AD4] px-8 py-[1.3rem] text-white dark:bg-silver-200 dark:text-gray-300 tablet:mt-0 tablet:space-y-2 tablet:rounded-t-[0.86513rem] tablet:px-16 tablet:py-6">
        <h1 className="pb-3 text-center text-[0.875rem] font-bold leading-[0.875rem] dark:text-gray-300 tablet:pb-[10px] tablet:text-[1.25rem] tablet:leading-[1.25rem]">
          What Is Foundation?
        </h1>

        <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
          Foundation is a new kind of anonymous social platform designed to help you figure out what's true. By
          leveraging collective human intelligence and trusted data in a unique new way, when you benefit, we all
          benefit.
        </p>
        <h1 className="pb-3 text-center text-[0.875rem] font-bold leading-[0.875rem] dark:text-gray-300 tablet:pb-[10px] tablet:text-[1.25rem] tablet:leading-[1.25rem]">
          Why Foundation?
        </h1>

        <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
          In a world where personal data is often exploited, Foundation returns power to users. Here, your insights and
          expertise are valued, and your data stays in your control. Every interaction, contribution, and piece of
          knowledge shared is supported by advanced encryption, ensuring a secure experience for everyone. Foundation is
          the space where privacy, authenticity, and value align.
        </p>
      </div>
      {/* <div className="mt-4 bg-[#238AD4] px-8 py-[1.3rem] text-white dark:border-gray-100 dark:bg-silver-200 tablet:px-16 tablet:py-6 tablet:dark:border-y-[2.56px]">
        <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-start tablet:text-[1.125rem] tablet:leading-[179.006%]">
          Foundation is a revolutionary data exchange platform where users can monetize their personal data, insights
          and achievements in a secure and anonymous environment. Imagine brands paying you to show you an ad!
        </p>
      </div> */}
      <div className="text-gray-1 bg-[#F5F6F8] px-8 py-[1.3rem] dark:border-gray-100 dark:bg-silver-300 dark:text-gray-300 tablet:px-16 tablet:py-6 tablet:dark:border-b-[2.56px]">
        <h1 className="text-center text-[0.875rem] font-bold leading-[0.875rem] tablet:text-[1.25rem] tablet:leading-[1.25rem]">
          Key Features
        </h1>
        <div className="mt-[1.425rem] space-y-[15px] tablet:mt-[1.125rem] tablet:space-y-4">
          {/* <div className="flex items-start gap-[0.8rem] tablet:gap-[1.15rem]"> 
           <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/addUser.svg' : 'assets/about/account.svg'}`}
              alt="account"
              className="size-5 tablet:size-[1.875rem]"
            /> */}
          <div className="w-full space-y-[0.6rem] text-left tablet:space-y-1">
            <h5 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-normal">
              Explore and Personalize Your Feed
            </h5>
            <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              With Foundation, you’re in charge of your experience. Customize your feed with posts and insights relevant
              to your interests—no algorithm interference. Filter by categories, professions, education, and personal
              interests to see the content that resonates most with you, putting you in complete control of the
              information you consume.
            </p>
          </div>
          {/* </div> */}
          {/*<div className="flex items-start gap-[0.8rem] tablet:gap-[1.15rem]">
             <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/chat.svg' : 'assets/about/conversation.svg'}`}
              alt="conversation"
              className="size-5 tablet:h-[1.875rem] tablet:w-[2.13rem]"
            /> */}
          <div className="w-full space-y-[0.6rem] text-left tablet:space-y-1">
            <h5 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              Earn Rewards with Every Action
            </h5>
            <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              Your contributions matter on Foundation. For every post created, insight shared, or interaction made,
              you’ll earn FDX tokens, our native utility token designed to reflect the value you bring to the platform.
              FDX tokens allow you to benefit directly from your engagement, fueling a reward system that values your
              presence and input.
            </p>
            {/* <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
                Every post is anonymous, so the focus can stay on the conversation, not personal attacks.
              </p> */}
            {/* </div> */}
          </div>
          {/*<div className="flex items-start gap-[0.8rem] tablet:gap-[1.15rem]">
             <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/dollar.svg' : 'assets/about/asset.svg'}`}
              alt="account"
              className="size-5 tablet:size-[1.875rem]"
            /> */}
          <div className="w-full space-y-[0.6rem] text-left tablet:space-y-1">
            <h5 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              Access News Curated by Community Insights
            </h5>
            <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              Foundation redefines news by integrating the power of community insights. Rather than relying on
              algorithms, our AI curates articles based on real user contributions, resulting in a Human
              Intelligence-based newsfeed that reflects genuine perspectives. This means no hidden agendas and no
              bias—just real stories shaped by collective truth.
            </p>
          </div>
          <div className="w-full space-y-[0.6rem] text-left tablet:space-y-1">
            <h5 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              Verification Badges: Boosting Authenticity and Security
            </h5>
            <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              Verification Badges enhance your profile’s credibility and value on Foundation. By verifying details like
              your name, location, work, or education, you build a robust, trusted profile while unlocking more
              personalized rewards. Each badge adds another layer of trust, helping distinguish verified users in a
              secure environment. And with our data encryption practices, your personal information remains private and
              protected.
            </p>
          </div>
          <div className="w-full space-y-[0.6rem] text-left tablet:space-y-1">
            <h5 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              Build Your Personalized Home Page
            </h5>
            <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              For creators, influencers, and professionals, Foundation offers a unique Home Page where you can share
              posts, collection, news, and all your essential links in one place. Connect with audiences meaningfully
              and streamline your online presence in a dedicated space designed for engagement.
            </p>
          </div>
          <div className="w-full space-y-[0.6rem] text-left tablet:space-y-1">
            <h5 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              Participate in Research for Global Impact
            </h5>
            <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              Foundation enables you to contribute to studies, market research, and trend analysis that drive positive
              change. By sharing your insights and participating in community-driven research, you help fuel
              advancements and innovations that benefit the world, from market shifts to scientific breakthroughs.
            </p>
          </div>
        </div>
        {/* </div> */}
      </div>
      <div className="space-y-[0.63rem] bg-[#238AD4] px-8 py-[1.3rem] text-white dark:bg-silver-200 dark:text-gray-300 tablet:mt-0 tablet:space-y-2 tablet:rounded-b-[0.86513rem] tablet:px-16 tablet:py-6">
        {/* <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/lock.svg' : 'assets/about/lock.svg'}`}
          alt="account"
          className="h-10 w-7 tablet:h-[2.18rem] tablet:w-[1.53rem]"
        /> */}
        <h5 className="pb-3 text-center text-[0.875rem] font-bold leading-[0.875rem] dark:text-gray-300 tablet:pb-[10px] tablet:text-[1.25rem] tablet:leading-[1.25rem]">
          Your Privacy, Your Control
        </h5>
        <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
          Privacy is foundational. On Foundation, data encryption and user control are central to every experience. You
          decide what information to share, and our privacy-first approach ensures that interactions stay secure and
          anonymous. With comprehensive data protection, your Foundation journey is yours to shape confidently.
        </p>
      </div>
      {persistedUserInfo.role !== 'user' && (
        <div className="mt-5 flex flex-col items-center gap-[15px] bg-[#156DB4] px-12 py-[1.3rem] text-white dark:border-gray-100 dark:bg-silver-200 tablet:mt-5 tablet:gap-[1.56rem] tablet:rounded tablet:py-[1.92rem] tablet:dark:border-t-[2.56px]">
          <h1 className="text-center text-[0.875rem] font-normal leading-[161.2%] tablet:text-[1.56rem] tablet:font-bold">
            Join the Movement
          </h1>
          <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
            Foundation is more than a platform; it’s a movement for a transparent, secure, and people-driven future.
            Join us in creating a world where your voice, insights, and contributions matter, and where digital
            interaction respects and rewards individuality. Be part of the change, make an impact, and earn rewards
            along the way—start your journey on Foundation today.
          </p>
          <button
            className="w-48 rounded-[0.31rem] bg-white py-[0.6rem] text-center text-[0.75rem] font-semibold text-[#156DB4] tablet:w-[24.3rem] tablet:rounded-[0.75rem] tablet:py-3 tablet:text-[1.25rem]"
            onClick={() => {
              // dispatch(setCredentialRegister(true));
              dispatch(setGuestSignUpDialogue('Please create an account to unlock all features and claim your FDX.'));
            }}
          >
            Sign Up
          </button>
          <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
            Take control, earn rewards, and make a meaningful impact—join Foundation today.
          </p>
          <p className="text-center text-[0.75rem] font-normal leading-[161.2%] tablet:text-[1.125rem]">
            Already have an account?{' '}
            <span
              className="cursor-pointer underline"
              onClick={() => {
                dispatch(setCredentialLogin(true));
              }}
            >
              Log in
            </span>
          </p>
        </div>
      )}

      {/* <div className="flex flex-col gap-[0.69rem] p-8 text-gray-1 tablet:gap-[1.56rem] tablet:px-16 tablet:pb-[3.12rem] tablet:pt-[1.88rem]">
        <h5 className="text-[0.75rem] font-normal italic leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[161%]">
          “Owning our personal data liberates us from being slaves to the system, giving us the freedom to live life on
          our terms.“
        </h5>
        <h5 className="text-[0.75rem] font-semibold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[161%]">
          Justin Leffew <br />
          CEO Foundation Internet Organization
        </h5>
      </div> */}
    </div>
  );
};

export default About;

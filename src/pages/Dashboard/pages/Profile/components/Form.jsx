import { useSelector } from 'react-redux';
import Input from '../../../../../components/Input';
import PasswordStrengthBar from 'react-password-strength-bar';

const Form = ({
  password,
  reTypePassword,
  showPassword,
  toggleVisibilityCrntPass,
  showCrntPass,
  toggleVisibilityNewPass,
  showNewPass,
  toggleVisibilityNewCnfrmPass,
  showNewCnfrmPass,
  togglePasswordVisibility,
  showCnfmPassword,
  toggleCnfmPasswordVisibility,
  onCrntPassChange,
  onNewPassChange,
  onCnfrmNewPassChange,
}) => {
  const crntPassinputType = showCrntPass ? 'text' : 'password';
  const newPassinputType = showNewPass ? 'text' : 'password';
  const cnfrmnewPassinputType = showNewCnfrmPass ? 'text' : 'password';
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <form className="text-gray mt-6 w-full gap-11 dark:text-white 5xl:gap-14 short:gap-[38px]">
      <div className="flex flex-col justify-between gap-5 tablet:flex-row">
        <div className="h-[50px] xl:h-[66px]">
          <div className="relative grid w-full grid-cols-[1fr] items-center">
            <Input
              type={crntPassinputType}
              id="password"
              label="Current Password"
              className="dark:bg-dark peer w-full rounded-[2px] border-b-[1.4px] border-[#C0C0C0] bg-white py-1 pr-8 text-[12px] transition-colors focus:border-b-[1.4px] focus:border-[#C0C0C0] focus:outline-none dark:border-white dark:focus:border-white md:text-[22.9px] short:py-0 taller:text-[16px]"
              autoComplete="new-password"
              onChange={onCrntPassChange}
            />
            {!showCrntPass ? (
              persistedTheme === 'dark' ? (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/blind.svg`}
                  alt="blind"
                  className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                  onClick={toggleVisibilityCrntPass}
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye-white.svg`}
                  alt="blind"
                  className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                  onClick={toggleVisibilityCrntPass}
                />
              )
            ) : persistedTheme === 'dark' ? (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye.svg`}
                alt="blind"
                className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                onClick={toggleVisibilityCrntPass}
              />
            ) : (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eyeLight.svg`}
                alt="blind"
                className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                onClick={toggleVisibilityCrntPass}
              />
            )}
          </div>
          <div className="relative -top-1 mt-1 h-[19px]">{password && <PasswordStrengthBar password={password} />}</div>
        </div>
        <div className="h-[50px] xl:h-[66px]">
          <div className="relative grid w-full grid-cols-[1fr] items-center">
            <Input
              type={newPassinputType}
              id="password"
              label="New Password"
              className="dark:bg-dark peer w-full rounded-[2px] border-b-[1.4px] border-[#C0C0C0] bg-white py-1 pr-8 text-[12px] transition-colors focus:border-b-[1.4px] focus:border-[#C0C0C0] focus:outline-none dark:border-white dark:focus:border-white md:text-[22.9px] short:py-0 taller:text-[16px]"
              autoComplete="new-password"
              onChange={onNewPassChange}
            />
            {!showNewPass ? (
              persistedTheme === 'dark' ? (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/blind.svg`}
                  alt="blind"
                  className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                  onClick={toggleVisibilityNewPass}
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye-white.svg`}
                  alt="blind"
                  className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                  onClick={toggleVisibilityNewPass}
                />
              )
            ) : persistedTheme === 'dark' ? (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye.svg`}
                alt="blind"
                className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                onClick={toggleVisibilityNewPass}
              />
            ) : (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eyeLight.svg`}
                alt="blind"
                className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                onClick={toggleVisibilityNewPass}
              />
            )}
          </div>
          <div className="relative -top-1 mt-1 h-[19px]">{password && <PasswordStrengthBar password={password} />}</div>
        </div>
        <div className="h-[50px] xl:h-[66px]">
          <div className="relative grid w-full grid-cols-[1fr] items-center">
            <Input
              type={cnfrmnewPassinputType}
              id="password"
              label="Re-type Password"
              className="dark:bg-dark peer w-full rounded-[2px] border-b-[1.4px] border-[#C0C0C0] bg-white py-1 pr-8 text-[12px] transition-colors focus:border-b-[1.4px] focus:border-[#C0C0C0] focus:outline-none dark:border-white dark:focus:border-white md:text-[22.9px] short:py-0 taller:text-[16px]"
              autoComplete="new-password"
              onChange={onCnfrmNewPassChange}
            />
            {!showNewCnfrmPass ? (
              persistedTheme === 'dark' ? (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/blind.svg`}
                  alt="blind"
                  className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                  onClick={toggleVisibilityNewCnfrmPass}
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye-white.svg`}
                  alt="blind"
                  className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                  onClick={toggleVisibilityNewCnfrmPass}
                />
              )
            ) : persistedTheme === 'dark' ? (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye.svg`}
                alt="blind"
                className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                onClick={toggleVisibilityNewCnfrmPass}
              />
            ) : (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eyeLight.svg`}
                alt="blind"
                className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                onClick={toggleVisibilityNewCnfrmPass}
              />
            )}
          </div>
          <div className="relative -top-1 mt-1 h-[19px]">
            {reTypePassword && <PasswordStrengthBar password={reTypePassword} />}
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;

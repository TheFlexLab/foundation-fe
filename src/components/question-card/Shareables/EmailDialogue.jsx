import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendEmail } from '../../../services/api/DialogueApis';
import showToast from '../../ui/Toast';

const EmailDialogue = ({ handleClose, id }) => {
  const { protocol, host } = window.location;
  let url = `${protocol}//${host}/post/${id}`;
  const [payload, setPayload] = useState({
    email: '',
    subject: '',
    message: `Here is the link ${url} of the quest. Please feel free to engage with the quest`,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  const { mutateAsync: userSendEmail } = useMutation({
    mutationFn: sendEmail,
    onSuccess: (resp) => {
      toast.success(resp.data.message);
      setPayload({
        email: '',
        subject: '',
        message: '',
      });
      handleClose();
    },
    onError: (err) => {
      showToast('error', 'error', {}, err.response.data);
    },
  });

  return (
    <div className="relative w-[90vw] laptop:w-[52.6rem]">
      <div className="social-blue-gradiant relative flex items-center gap-[10px] rounded-t-[9.251px] px-[15px] py-1 tablet:gap-4 tablet:rounded-t-[26px] tablet:px-[30px] tablet:py-[8px]">
        <div className="w-fit rounded-full bg-white p-[5px] tablet:p-[10px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[14px] w-[14px] tablet:h-[31px] tablet:w-[31px]"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M12.9623 2.84338H3.07552C2.63865 2.84385 2.2198 3.01685 1.91088 3.32443C1.60196 3.632 1.4282 4.04903 1.42773 4.48401V11.5153C1.4282 11.9502 1.60196 12.3673 1.91088 12.6748C2.2198 12.9824 2.63865 13.1554 3.07552 13.1559H12.9623C13.3991 13.1554 13.818 12.9824 14.1269 12.6748C14.4358 12.3673 14.6096 11.9502 14.61 11.5153V4.48401C14.6096 4.04903 14.4358 3.632 14.1269 3.32443C13.818 3.01685 13.3991 2.84385 12.9623 2.84338ZM12.545 5.55715L8.30784 8.83841C8.22522 8.90236 8.12355 8.93708 8.01889 8.93708C7.91424 8.93708 7.81256 8.90236 7.72994 8.83841L3.49277 5.55715C3.44298 5.51972 3.40117 5.47281 3.36975 5.41915C3.33834 5.36549 3.31794 5.30615 3.30976 5.24457C3.30158 5.183 3.30577 5.12042 3.32208 5.06047C3.3384 5.00052 3.36652 4.9444 3.40482 4.89536C3.44311 4.84633 3.49081 4.80536 3.54514 4.77484C3.59947 4.74431 3.65935 4.72485 3.72131 4.71757C3.78326 4.71029 3.84605 4.71534 3.90602 4.73243C3.966 4.74952 4.02197 4.7783 4.07067 4.81711L8.01889 7.87454L11.9671 4.81711C12.0658 4.74288 12.1899 4.71033 12.3126 4.72648C12.4352 4.74264 12.5466 4.80622 12.6225 4.90346C12.6984 5.0007 12.7329 5.1238 12.7184 5.24613C12.7039 5.36846 12.6416 5.48019 12.545 5.55715Z"
              fill="#107CE0"
            />
          </svg>
        </div>
        <p className="text-[12px] font-bold text-white tablet:text-[20px] tablet:font-medium">Email</p>
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
      <div className="mx-[19px] flex flex-col gap-[10.76px] pb-[17px] pt-[25px] tablet:mx-[40px] tablet:gap-[15px] tablet:pb-6 laptop:mx-[64px]">
        <div className="border-white-500 flex w-full rounded-[10px] border px-[16.6px] py-3 text-[12px] font-normal leading-none text-[#435059] tablet:rounded-[15px] tablet:border-[3px] tablet:px-[43px] tablet:py-[14px] tablet:text-[20px] tablet:font-bold">
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            type="email"
            className="w-full rounded-[26px] bg-white pl-[33px] outline-none tablet:pl-[102px]"
            value={payload.email}
            onChange={handleChange}
          />
        </div>
        <div className="border-white-500 flex w-full rounded-[10px] border px-[16.6px] py-3 text-[12px] font-normal leading-none text-[#435059] tablet:rounded-[15px] tablet:border-[3px] tablet:px-[43px] tablet:py-[14px] tablet:text-[20px] tablet:font-bold">
          <label htmlFor="Subject">Subject:</label>
          <input
            name="subject"
            type="text"
            className="w-full rounded-[26px] bg-white pl-[33px] outline-none tablet:pl-[102px]"
            value={payload.subject}
            onChange={handleChange}
          />
        </div>
        <div className="border-white-500 flex w-full rounded-[10px] border px-[16.6px] py-3 text-[12px] font-normal leading-none text-[#435059] tablet:rounded-[15px] tablet:border-[3px] tablet:px-[43px] tablet:py-[14px] tablet:text-[20px] tablet:font-bold">
          <label htmlFor="Subject">Message:</label>
          <textarea
            name="message"
            type="text"
            rows={8}
            className="w-full rounded-[26px] bg-white pl-[33px] outline-none tablet:pl-[102px]"
            value={payload.message}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="w-[99px] rounded-[8.66px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[9.4px] py-1 text-[12px] font-semibold leading-normal text-white tablet:mt-[5px] tablet:w-[246px] tablet:rounded-[21.33px] tablet:px-5 tablet:py-[11.38px] tablet:text-[28.44px]"
            onClick={() => {
              userSendEmail(payload);
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailDialogue;

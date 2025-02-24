import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

export default function OthersProfileCard(props: { data: any; innerRef: any }) {
  const { data, innerRef } = props;
  const navigate = useNavigate();

  return (
    <div
      ref={innerRef}
      className="flex flex-col items-center rounded-[13.84px] border-[1.846px] border-[#D9D9D9] bg-white dark:border-gray-100 dark:bg-gray-200"
    >
      <div className="flex w-full items-center gap-[14px] p-[18px] tablet:gap-6 tablet:p-5">
        <div>
          <div className="flex size-[60px] min-w-[60px] flex-col gap-[6px] rounded-full border-[5px] border-[#C9C8C8] tablet:size-[185px] tablet:min-w-[185px]">
            <img
              src={data?.domain.s3Urls[0]}
              alt={data?.domain.title}
              className="size-[50px] rounded-full object-cover tablet:size-[175px]"
            />
          </div>
        </div>
        <div className="text-gray-1 flex flex-col gap-2 dark:text-[#f1f1f1] tablet:gap-4">
          <div>
            <h1 className="text-[12px] font-semibold tablet:text-[20px]">{data?.domain.title}</h1>
            <p className="text-[10px] leading-normal tablet:text-[16px]">{`${data?.domain.name}.${window.location.hostname}`}</p>
          </div>
          <p className="text-[11px] leading-normal tablet:text-[18px]">{data?.domain.description}</p>
        </div>
      </div>
      <div className="tablet:text-[20px]] flex w-full justify-end px-[18px] pb-[18px] text-[12px] font-semibold tablet:gap-2 tablet:px-5 tablet:pb-5">
        <Button
          variant="cancel"
          onClick={() => {
            navigate(`/h/${data.domain.name}`);
          }}
        >
          View Profile
        </Button>
      </div>
    </div>
  );
}

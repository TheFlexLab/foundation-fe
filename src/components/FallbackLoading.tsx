export default function FallbackLoading() {
  return (
    <div className="relative flex h-dvh w-full items-center justify-center bg-white dark:bg-black">
      <img
        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/F.svg`}
        alt="arrow-right.svg"
        className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 tablet:size-14"
      />
      <img
        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/foundation-spinner.svg`}
        alt="arrow-right.svg"
        className="size-24 animate-spin tablet:size-40"
      />
    </div>
  );
}

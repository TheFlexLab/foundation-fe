const Loader = () => {
  return (
    <div className="absolute bottom-0 top-0 z-50 flex h-screen w-screen items-center justify-center overflow-hidden bg-gray-100 bg-opacity-75 text-center">
      <span className="loading loading-ring loading-lg text-black"></span>
    </div>
  );
};

export default Loader;

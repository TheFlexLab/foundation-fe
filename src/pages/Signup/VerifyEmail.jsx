const VerifyEmail = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col gap-6 justify-center items-center">
      <h1 className="font-bold text-2xl">Verify Your Account</h1>
      <p>
        A verification email will be sent when you click the button. Please check your email and follow the instructions
        to verify your account once it's sent.
      </p>
      <form>
        <input type="email" />
      </form>
    </div>
  );
};

export default VerifyEmail;

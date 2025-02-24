import { useEffect } from 'react';

export default function FallBack({ error }) {
  //   useEffect(() => {
  //     const timerId = setTimeout(() => {
  //       window.location.reload(); // Reload the page after 5 seconds
  //     }, 5000); // 5000 milliseconds = 5 seconds

  //     return () => clearTimeout(timerId); // Clean up the timer on component unmount
  //   }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-wrap px-20 text-2xl font-bold">
      <div className="flex flex-col items-center gap-3">
        <p>Something went wrong:</p>
        <p style={{ color: 'red' }}> {error && error.toString()}</p>
      </div>
      {/* <p>Reloading the site in 5sec...</p> */}
    </div>
  );
}

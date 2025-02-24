import { useSelector } from 'react-redux';

const Test = () => {
  const persistedUserInfo = useSelector((state: any) => state.auth.user);

  const stripeBadge = persistedUserInfo?.badges?.find((badge: any) => badge.type === 'stripe');

  if (!stripeBadge) {
    return <div>No Stripe Badge Found</div>;
  }

  return (
    <div>
      <h1>Stripe QR Code</h1>
      {stripeBadge.data?.qrCode ? (
        <img src={stripeBadge.data.qrCode} alt="Stripe QR Code" />
      ) : (
        <p>QR Code not available</p>
      )}
    </div>
  );
};

export default Test;

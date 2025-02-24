import ImagePopUp from '../ui/ImagePopUp';

export default function FullScreenPicturePopup({ handleClose, modalVisible, content, imgArr }) {
  return <ImagePopUp open={modalVisible} handleClose={handleClose} data={imgArr} selectedImg={content} />;
}

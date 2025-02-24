// import { useSelector } from 'react-redux';
// import { TextareaAutosize } from '@mui/material';
// import { Button } from '../../../../components/ui/Button';
// import { useQuery } from '@tanstack/react-query';
// import { findPostsByCategoryId } from '../../../../services/api/listsApi';
// import { useParams } from 'react-router-dom';
// import { useState } from 'react';
// import ManagePostInListPopup from '../../../../components/dialogue-boxes/ManagePostInListPopup';

// const ManageList = () => {
//   const persistedTheme = useSelector((state) => state.utils.theme);
//   const persistedUserInfo = useSelector((state) => state.auth.user);
//   let { categoryId } = useParams();

//   const [addPost, setAddPost] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);

//   const handleClose = () => setModalVisible(false);

//   return (
//     <div className="my-[15px] ml-[31px] hidden h-fit w-[18.75rem] min-w-[18.75rem] cursor-pointer items-center justify-center rounded-[15px] bg-white px-[1.13rem] py-[1.5rem] laptop:flex dark:bg-[#000]">
//       {modalVisible && (
//         <ManagePostInListPopup
//           handleClose={handleClose}
//           modalVisible={modalVisible}
//           title={'Add Post'}
//           image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/hiddenposts/unhide/delIcon.svg`}
//           categoryId={categoryId}
//         />
//       )}
//       <Button variant={'addOption-fit'} onClick={() => setModalVisible(true)}>
//         + Add Post
//       </Button>
//     </div>
//   );
// };

// export default ManageList;

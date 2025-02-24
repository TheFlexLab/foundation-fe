import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchResults } from '../../services/api/questsApi';
import { changeThemeTo } from '../../features/utils/utilsSlice';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import FallbackLoading from '../../components/FallbackLoading';

const EmbedPost = () => {
  let { link } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    dispatch(changeThemeTo(queryParams.get('darkMode') == 'true' ? 'dark' : 'light'));
  }, [location.search]);

  const { data: singleQuestData, isFetching } = useQuery({
    queryKey: ['emdedPost'],
    queryFn: () => fetchResults(link),
  });

  const resize = () => {
    setInterval(() => {
      const appHeight = document.querySelector('.card-iframe')?.clientHeight;

      if (appHeight) {
        window.parent.postMessage({ height: appHeight + 4.25 }, '*');
      }
    }, 100); // 10 updates per second
  };

  useEffect(() => {
    resize();
  }, []);

  const queryParams = new URLSearchParams(location.search);

  return (
    <>
      {isFetching ? (
        <FallbackLoading />
      ) : (
        singleQuestData &&
        singleQuestData?.data?.map((item, index) => (
          <QuestionCardWithToggle
            key={index + 1}
            questStartData={item}
            isBookmarked={false}
            isSingleQuest={true}
            postLink={link}
            postProperties={'Embed'}
            isEmbedResults={queryParams.get('results') === 'true' ? true : false}
          />
        ))
      )}
    </>
  );
};

export default EmbedPost;

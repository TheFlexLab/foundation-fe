import { FaCircleArrowUp } from 'react-icons/fa6';
import { formatDateMDY } from '../../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useChatGptDataMutation } from '../../../services/mutations/seldon-ai';
import { getSeldonState, handleSeldonInput } from '../../../features/seldon-ai/seldonSlice';
import { addDebug, getSeldonDataStates, setSeldonData } from '../../../features/seldon-ai/seldonDataSlice';
import Markdown from 'react-markdown';
import SourcePosts from './components/SourcePosts';
import SeldonInputs from './components/SeldonInputs';
import SuggestedPosts from './components/SuggestedPosts';
import DotsLoading from '../../../components/ui/DotsLoading';

export default function SeldonAi() {
  const dispatch = useDispatch();
  const seldonState = useSelector(getSeldonState);
  const getSeldonDataState = useSelector(getSeldonDataStates);

  const { mutateAsync: handleSendPrompt, isPending } = useChatGptDataMutation();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await handleSendPrompt({
        params: seldonState,
      } as any);

      if (response?.status === 200) {
        const ids = response.data?.source
          .filter((fileName: string) => fileName.startsWith('post_'))
          .map((fileName: any) => fileName.match(/post_(\w+)\.pdf/)[1]);

        if (response.data.debug) {
          dispatch(addDebug({ debug: response.data.debug, source: ids }));
        } else {
          dispatch(
            setSeldonData({
              debug: response.data.debug,
              title: response.data.response.title,
              abstract: response.data.response.abstract,
              seoSummary: response.data.response.seoSummary,
              groundBreakingFindings: response.data.response.groundBreakingFindings,
              discussion: response.data.response.discussion,
              conclusion: response.data.response.conclusion,
              suggestions: response.data.response.suggestions,
              createdAt: response.data.response?.articleInfo?.createdAt
                ? response.data.response?.articleInfo?.createdAt
                : new Date().toISOString(),
              source: ids,
              articleId: '',
              prompt: seldonState.question,
              updatedAt: response.data.response?.articleInfo?.updatedAt
                ? response.data.response?.articleInfo?.updatedAt
                : null,
            })
          );
        }
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };

  const createdAtDate = getSeldonDataState?.createdAt
    ? new Date(getSeldonDataState.createdAt).toISOString().split('T')[0]
    : '';
  const updatedAtDate = getSeldonDataState?.updatedAt
    ? new Date(getSeldonDataState?.updatedAt).toISOString().split('T')[0]
    : '';

  return (
    <div className="mx-auto mb-[10px] rounded-[10px] px-4 tablet:mb-[15px] tablet:max-w-[730px] tablet:px-0">
      <div className="mb-3 block laptop:hidden">
        <SeldonInputs />
      </div>
      <form className="relative flex gap-4" onSubmit={handleFormSubmit}>
        <TextareaAutosize
          className="focus:shadow-outline text-gray-1 w-full resize-none appearance-none rounded-lg border bg-white py-1.5 pl-3 pr-12 text-[14px] leading-[14px] shadow focus:outline-none dark:bg-gray-200 tablet:rounded-[10px] tablet:text-[20px] tablet:leading-tight"
          placeholder="Message Seldon"
          onChange={(e) => {
            dispatch(handleSeldonInput({ name: 'question', value: e.target.value }));
          }}
          onKeyDown={handleKeyDown}
          value={seldonState.question}
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 size-4 -translate-y-1/2 tablet:bottom-2.5 tablet:size-6"
        >
          <FaCircleArrowUp className="text-gray-1 size-4 rotate-180 hover:text-black tablet:size-6" />
        </button>
      </form>

      {isPending ? (
        <DotsLoading />
      ) : (
        <div className="flex flex-col gap-4 pt-4 text-gray-500 dark:text-white tablet:pt-8">
          {getSeldonDataState.debug ? (
            <div className="text-gray-1 rounded-[10px] border-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:py-[18.73px]">
              <h1 className="text-[16px] font-bold">Debug Mode:</h1>
              <br></br>
              <Markdown>{getSeldonDataState.debug}</Markdown>
            </div>
          ) : (
            getSeldonDataState.title !== '' && (
              <>
                <div className="space-y-1">
                  <h1 className="text-[16px] font-bold tablet:text-[24px]">{getSeldonDataState.title}</h1>
                  <h5 className="text-[14px] tablet:text-[20px]">Foundation News</h5>
                  {getSeldonDataState.createdAt !== '' && (
                    <p className="text-[10px] tablet:text-[16px]">
                      Published: {formatDateMDY(getSeldonDataState.createdAt)}
                    </p>
                  )}
                  {getSeldonDataState.updatedAt !== null && updatedAtDate !== createdAtDate && (
                    <p className="text-[10px] tablet:text-[16px]">
                      Last Updated: {formatDateMDY(getSeldonDataState.updatedAt)}
                    </p>
                  )}
                </div>
                <p className="text-[12px] tablet:text-[20px]">
                  <strong>Seo Summary </strong>
                  {getSeldonDataState.seoSummary}
                </p>
                <p className="text-[12px] tablet:text-[20px]">{getSeldonDataState.abstract}</p>
                <div className="flex flex-col items-start gap-2 tablet:mt-[10px] tablet:gap-5">
                  <button
                    onClick={() => {
                      const selectedButton = document.getElementById('posts-list');
                      if (selectedButton) {
                        selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }
                    }}
                    className="cursor-pointer text-[14px] font-normal leading-[121.4%] text-blue-200 hover:underline dark:text-blue-600 tablet:-mt-3 tablet:text-[20px]"
                  >
                    View posts that informed this article
                  </button>
                  <button
                    onClick={() => {
                      const selectedButton = document.getElementById('posts-ideas');
                      if (selectedButton) {
                        selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }
                    }}
                    className="cursor-pointer text-[14px] font-normal leading-[121.4%] text-blue-200 hover:underline dark:text-blue-600 tablet:-mt-3 tablet:text-[20px]"
                  >
                    Get post ideas and earn FDX
                  </button>
                </div>
                {getSeldonDataState?.groundBreakingFindings.length > 0 && (
                  <h1 className="text-[16px] font-bold tablet:text-[24px]">Findings</h1>
                )}
                <ol className="list-disc space-y-4">
                  {getSeldonDataState?.groundBreakingFindings?.map(
                    (item: { heading: string; content: string }, index: number) => (
                      <li key={index} className="ml-6 text-[12px] tablet:ml-10 tablet:text-[20px]">
                        <strong className="font-bold">{item.heading}:</strong> {item.content}
                      </li>
                    )
                  )}
                </ol>
                <div>
                  <h1 className="text-[16px] font-bold tablet:text-[24px]">Discussion</h1>
                  <p className="text-[12px] tablet:text-[20px]">{getSeldonDataState.discussion}</p>
                </div>
                <div>
                  <h1 className="text-[16px] font-bold tablet:text-[24px]">Conclusion</h1>
                  <p className="text-[12px] tablet:text-[20px]">{getSeldonDataState.conclusion}</p>
                </div>
              </>
            )
          )}
          {getSeldonDataState.title !== '' && (
            <>
              <SourcePosts />
              <SuggestedPosts />
            </>
          )}
        </div>
      )}
    </div>
  );
}

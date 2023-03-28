import ShowChapterContent from "./ShowChapterContent";
import useChapterContent from "../../helpers/useChapterContent";
import ChapterFilter from "./ChapterFilter";

export default function Home() {
  const { chapterContent, setChapterContent, getChapter, isLoading } =
    useChapterContent();

  return (
    <div className="p-3">
      <ChapterFilter
        selectedChapterChanged={(selectedChapterID) => {
          setChapterContent();
          getChapter(selectedChapterID);
        }}
      />

      <ShowChapterContent
        isLoading={isLoading}
        chapterContent={chapterContent}
      />
    </div>
  );
}

import ShowChapterContent from "./ShowChapterContent";
import ChapterFilter from "./ChapterFilter";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [params, setParams] = useSearchParams();

  const selectedChapterID = params.has("sc") ? params.get("sc") : 0;

  return (
    <div className="p-3">
      <ChapterFilter
        selectedChapterID={selectedChapterID}
        setSelectedChapterID={(sc) => {
          const x = {};
          if (params.has("hl")) x.hl = params.get("hl");
          if (sc > 0) x.sc = sc;
          setParams(x);
        }}
      />

      <ShowChapterContent selectedChapterID={selectedChapterID} />
    </div>
  );
}

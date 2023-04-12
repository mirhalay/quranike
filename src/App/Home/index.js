import ShowChapterContent from "./ShowChapterContent";
import ChapterFilter from "./ChapterFilter";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

function getScParamVal(params) {
  if (params.has("sc")) {
    const in_t = parseInt(params.get("sc"));
    return isNaN(in_t) ? 0 : in_t;
  }
  return 0;
}

export default function Home() {
  const [params, setParams] = useSearchParams();

  const [selectedChapterID, setSelectedChapterID] = useState(
    getScParamVal(params)
  );

  useEffect(() => {
    const sc = getScParamVal(params);
    if (sc > 0) setSelectedChapterID(sc);
  }, [params]);

  const selectedVersesString = params.has("ta") ? params.get("ta") : null;

  return (
    <div className="p-3">
      <ChapterFilter
        selectedChapterID={selectedChapterID}
        setSelectedChapterID={(scIDStr, changeParam = true) => {
          if (changeParam) {
            const x = {};
            if (params.has("hl")) x.hl = params.get("hl");
            if (scIDStr > 0) x.sc = scIDStr;
            setParams(x);
          }
          setSelectedChapterID(parseInt(scIDStr));
        }}
      />

      <ShowChapterContent
        selectedChapterID={selectedChapterID}
        selectedVersesString={selectedVersesString}
        setSelectedVersesString={(ta, reset = false) => {
          const x = {
            ...Object.fromEntries(params.entries()),
            ta,
          };
          if (!x.ta || reset) delete x.ta;
          setParams(x);
        }}
      />
    </div>
  );
}

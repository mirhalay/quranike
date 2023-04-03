import axios from "axios";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

export default function useChapterContent() {
  const { locale } = useIntl();
  const [chapterContent, setChapterContent] = useState(null);

  const chapterGetter = (chapter) => {
    setChapterContent(undefined);
    axios
      .get(`chapters/${[locale.substring(0, 2)]}/${chapter}.json`)
      .then(({ status, data }) => {
        if (status === 200) {
          const numVerses = data.verses.length;

          data.verses = data.verses
            .filter(
              (val, index, arr) =>
                index === 0 || val.translation !== arr[index - 1].translation
            )
            .map((item, index, arr) => {
              const nextID = arr[index + 1]?.id ?? numVerses + 1;

              if (nextID && item.id + 1 !== nextID)
                item.id = `${item.id}-${nextID - 1}`;
              return item;
            });

          setChapterContent(data);
        }
      });
  };

  useEffect(() => {
    if (chapterContent) chapterGetter(chapterContent.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return {
    chapterContent,
    isLoading: chapterContent === undefined,
    setChapterContent,
    getChapter: (selectedChapterID) => {
      if (selectedChapterID > 0) {
        chapterGetter(selectedChapterID);
      } else setChapterContent(null);
    },
  };
}

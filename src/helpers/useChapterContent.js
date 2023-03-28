import axios from "axios";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

// const randomIntFromInterval = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

export default function useChapterContent() {
  const { locale } = useIntl();
  const [chapterContent, setChapterContent] = useState(null);

  const chapterGetter = (chapter) => {
    setChapterContent(undefined);
    axios
      .get(`chapters/${[locale.substring(0, 2)]}/${chapter}.json`)
      .then(({ status, data }) => {
        status === 200 && setChapterContent(data);
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
    getChapter: (selectedChapter) => {
      if (selectedChapter > 0) {
        chapterGetter(selectedChapter);
      } else setChapterContent(null);
    },
  };
}

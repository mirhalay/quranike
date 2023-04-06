import axios from "axios";
import { useState } from "react";

export default function useChapterContent() {
  const [chapterContent, setChapterContent] = useState(null);

  return {
    chapterContent,
    isLoading: chapterContent === undefined,
    setChapterContent,
    getChapter: (chapter, locale) => {
      if (chapter > 0) {
        setChapterContent(undefined);
        axios
          .get(`chapters/${[locale.substring(0, 2)]}/${chapter}.json`)
          .then(({ status, data }) => {
            if (status === 200) {
              const numVerses = data.verses.length;

              data.verses = data.verses
                .filter(
                  (val, index, arr) =>
                    index === 0 ||
                    val.translation !== arr[index - 1].translation
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
      } else setChapterContent(null);
    },
  };
}

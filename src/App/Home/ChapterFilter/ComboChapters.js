import { useEffect, useState } from "react";
import { Button, FormSelect, Stack } from "react-bootstrap";
import { useIntl } from "react-intl";
import chaptersJSON from "../../../chapters.json";
import { FaEllipsisH as SearchIcon } from "react-icons/fa";
import SearchChaptersModal from "./SearchChaptersModal";

export default function ComboChapters({
  selectedType,
  selectedChapter,
  setSelectedChapter,
}) {
  const [chapters] = useState(
    chaptersJSON.sort((j, k) => (j.reveal_order > k.reveal_order ? 1 : -1))
  );
  const { locale, $t } = useIntl();

  const [chaptersFilteredByType, setChaptersFilteredByType] = useState();

  useEffect(() => {
    const res = chapters.filter((i) => selectedType[i.type]);
    chapters?.length > 0 && setChaptersFilteredByType(res);

    if (
      res.findIndex((i) => {
        return i.id === parseInt(selectedChapter);
      }) === -1
    ) {
      setSelectedChapter(0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters, selectedType]);

  const [showSearchModal, setShowSearchModal] = useState();

  return (
    <Stack direction="horizontal">
      <FormSelect
        value={selectedChapter}
        onChange={(i) => setSelectedChapter(i.target.value)}
      >
        <option value={0}>[{$t({ id: "not_selected" })}]</option>
        {chaptersFilteredByType &&
          chaptersFilteredByType.map((i) => (
            <option key={i.id} value={i.id}>
              {i[locale.substring(0, 2)]} ({i.id})
            </option>
          ))}
      </FormSelect>

      <Button
        className="ms-1"
        onClick={() => setShowSearchModal(true)}
        size="sm"
        variant="outline-secondary"
      >
        <SearchIcon />
      </Button>

      <SearchChaptersModal
        onHide={setShowSearchModal}
        chapterList={showSearchModal && chaptersFilteredByType}
        onChapterSelected={function (chapterID) {
          if (chapterID) {
            setShowSearchModal(false);
            setSelectedChapter(chapterID);
          }
        }}
      />
    </Stack>
  );
}

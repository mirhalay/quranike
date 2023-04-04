import { useState } from "react";
import { Button, FormSelect, Stack } from "react-bootstrap";
import { useIntl } from "react-intl";
import chaptersJSON from "../../../chapters.json";
import { FaEllipsisH as SearchIcon } from "react-icons/fa";
import SearchChaptersModal from "./SearchChaptersModal";

export default function ComboChapters({
  selectedChapterID,
  setSelectedChapterID,
}) {
  const { locale, $t } = useIntl();
  const [showSearchModal, setShowSearchModal] = useState();
  const [chapters] = useState(
    chaptersJSON.sort((j, k) => (j.reveal_order > k.reveal_order ? 1 : -1))
  );

  return (
    <Stack direction="horizontal">
      <FormSelect
        value={selectedChapterID}
        onChange={(i) => setSelectedChapterID(i.target.value)}
      >
        <option value={0}>[{$t({ id: "not_selected" })}]</option>
        {chapters &&
          chapters.map((i) => (
            <option key={i.id} value={i.id}>
              {i[locale.substring(0, 2)]} :{i.id}
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
        chapterList={showSearchModal && chapters}
        onChapterSelected={function (chapterID) {
          if (chapterID) {
            setShowSearchModal(false);
            setSelectedChapterID(chapterID);
          }
        }}
      />
    </Stack>
  );
}

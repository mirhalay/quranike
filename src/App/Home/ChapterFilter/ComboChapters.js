import { useEffect, useState } from "react";
import { Button, FormSelect, Stack } from "react-bootstrap";
import { useIntl } from "react-intl";
import chaptersJSON from "../../../chapters.json";
import { FaEllipsisH as SearchIcon } from "react-icons/fa";
import SearchChaptersModal from "./SearchChaptersModal";
import {
  randomItemFromArray,
  randomIntFromInterval,
} from "../../../helpers/randoms";

export default function ComboChapters({
  selectedType,
  selectedChapterID,
  setSelectedChapterID,
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
        return i.id === parseInt(selectedChapterID);
      }) === -1
    ) {
      setSelectedChapterID(0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters, selectedType]);

  const [showSearchModal, setShowSearchModal] = useState();

  return (
    <Stack direction="horizontal">
      <FormSelect
        value={selectedChapterID}
        onChange={(i) => {
          const val = parseInt(i.target.value);
          return setSelectedChapterID(
            val === -1
              ? randomItemFromArray(chaptersFilteredByType)?.id ??
                  randomIntFromInterval(1, 114)
              : val
          );
        }}
      >
        <option value={0}>[{$t({ id: "not_selected" })}]</option>
        <option value={-1}>{`{${$t({ id: "random" })}}`}</option>
        {chaptersFilteredByType &&
          chaptersFilteredByType.map((i) => (
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
        chapterList={showSearchModal && chaptersFilteredByType}
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

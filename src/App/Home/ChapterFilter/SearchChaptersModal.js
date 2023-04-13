import { useState } from "react";
import { FormControl, ListGroup, Modal } from "react-bootstrap";
import { useIntl } from "react-intl";
import CheckType from "./CheckType";

function matchChapterName(needle, haystack, lang = "tr") {
  const hay_ = haystack[lang]
    .toLocaleUpperCase(lang)
    .replace("'", "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const nee_ = needle
    .toLocaleUpperCase(lang)
    .replace("'", "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return hay_.match(new RegExp(nee_, "gi"));
}

export default function SearchChaptersModal({
  onHide,
  chapterList,
  onChapterSelected,
  filterTypeState,
  currentChapterID,
}) {
  const { locale, $t } = useIntl();

  const [filterText, setFilterText] = useState("");

  const filteredChapters = filterText
    ? chapterList?.filter(
        (i) =>
          matchChapterName(filterText, i, locale.substring(0, 2)) ||
          i.id.toString().startsWith(filterText)
      )
    : chapterList;

  return (
    <Modal size="sm" show={chapterList} centered onHide={onHide}>
      <Modal.Body className="show-grid">
        <FormControl
          defaultValue={filterText}
          placeholder={$t({ id: "find_chapter" })}
          onKeyDown={(i) => {
            if (i.key === "Enter") setFilterText(i.target.value?.trim());
          }}
        />
        <div className="mb-2 border-bottom">
          <CheckType className="mb-1" filterTypeState={filterTypeState} />
        </div>
        {chapterList && (
          <ListGroup style={{ maxHeight: 350, overflowY: "scroll" }}>
            {filteredChapters?.map((i) => (
              <ListGroup.Item
                action={i.id !== currentChapterID && "#"}
                key={i.id}
                value={i.id}
                active={i.id === currentChapterID}
                onClick={
                  i.id === currentChapterID
                    ? () => null
                    : () => onChapterSelected(i.id)
                }
              >
                <span>
                  {`${i.id}. ${i[locale.substring(0, 2)]} (${
                    i.total_verses
                  } ${$t({ id: "verses" })})`}
                </span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
    </Modal>
  );
}

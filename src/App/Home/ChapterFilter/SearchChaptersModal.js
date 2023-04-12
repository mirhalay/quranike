import { useState } from "react";
import { FormControl, ListGroup, Modal } from "react-bootstrap";
import { useIntl } from "react-intl";
import CheckType from "./CheckType";

export default function SearchChaptersModal({
  onHide,
  chapterList,
  onChapterSelected,
  filterTypeState,
}) {
  const { locale, $t } = useIntl();

  const [filterText, setFilterText] = useState("");

  return (
    <Modal size="sm" show={chapterList} centered onHide={onHide}>
      <Modal.Header closeButton>
        <FormControl
          autoFocus
          defaultValue={filterText}
          placeholder={$t({ id: "find_chapter" })}
          onKeyDown={(i) => {
            if (i.key === "Enter") setFilterText(i.target.value?.trim());
          }}
        />
      </Modal.Header>
      <Modal.Body className="show-grid">
        <CheckType className="mb-1" filterTypeState={filterTypeState} />
        {chapterList && (
          <ListGroup style={{ maxHeight: 350, overflowY: "scroll" }}>
            {chapterList
              .filter(
                (i) =>
                  !filterText ||
                  i[locale.substring(0, 2)]
                    .toLowerCase()
                    .includes(filterText.toLowerCase()) ||
                  i.id.toString().startsWith(filterText)
              )
              .map((i) => (
                <ListGroup.Item
                  action="#"
                  key={i.id}
                  value={i.id}
                  onClick={() => onChapterSelected(i.id)}
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

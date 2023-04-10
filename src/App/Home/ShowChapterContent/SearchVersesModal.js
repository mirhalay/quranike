import { FormControl, Modal } from "react-bootstrap";
import { useIntl } from "react-intl";

export default function SearchVersesModal({
  onHide,
  show,
  filterText,
  setFilterText,
}) {
  const { $t } = useIntl();

  return (
    <Modal size="sm" show={show} centered onHide={onHide}>
      <Modal.Header closeButton>
        <FormControl
          autoFocus
          defaultValue={filterText}
          placeholder={$t({ id: "find_verse" })}
          onKeyDown={(i) => {
            if (i.key === "Enter")
              setFilterText(i.target.value?.trim().toLowerCase());
          }}
        />
      </Modal.Header>
    </Modal>
  );
}

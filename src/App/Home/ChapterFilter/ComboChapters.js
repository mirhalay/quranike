import { Button, FormSelect, FormText, Row, Stack } from "react-bootstrap";
import { FormattedMessage, useIntl } from "react-intl";

import { FaEllipsisH as SearchIcon } from "react-icons/fa";

export default function ComboChapters({
  selectedChapterID,
  setSelectedChapterID,
  chapters,
  showChaptersModal,
}) {
  const { locale, $t } = useIntl();

  return (
    selectedChapterID >= 0 && (
      <Stack direction="horizontal" className="mt-3 align-items-start">
        <FormText className="me-2">
          <FormattedMessage id="chapter" />:
        </FormText>
        <Row>
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
              onClick={showChaptersModal}
              size="sm"
              variant="outline-secondary"
            >
              <SearchIcon />
            </Button>
          </Stack>
        </Row>
      </Stack>
    )
  );
}

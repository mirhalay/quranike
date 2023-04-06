import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  FormCheck,
  Row,
  Spinner,
} from "react-bootstrap";
import { useIntl } from "react-intl";
import ComboPaginator from "../../core/ComboPaginator";
import useChapterContent from "../../helpers/useChapterContent";
import usePagination from "../../helpers/usePagination";

const PAGE_LEN = 25;

const TA_SPLITTER_SYMBOL = "*";

export default function ShowChapterContent({
  selectedChapterID,
  selectedVersesString,
  setSelectedVersesString,
}) {
  const { $t, locale } = useIntl();
  const { chapterContent, setChapterContent, getChapter, isLoading } =
    useChapterContent();

  const [selecting, setSelecting] = useState(null);

  const [pickedVerses, setPickedVerses] = useState([]);

  const paginator = usePagination(
    PAGE_LEN,
    chapterContent?.verses ?? [],
    (collection) =>
      pickedVerses.length > 0 && selecting === null
        ? collection.filter((i) => pickedVerses.includes(i.id.toString()))
        : collection
  );

  useEffect(() => {
    const selectedVersesArr =
      selectedVersesString?.split(TA_SPLITTER_SYMBOL).sort() ?? [];
    setPickedVerses(selectedVersesArr.length > 0 ? selectedVersesArr : []);
  }, [selectedVersesString]);

  useEffect(() => {
    if (selectedChapterID >= 0 && selectedChapterID <= 114) {
      setChapterContent();
      getChapter(selectedChapterID, locale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChapterID, locale]);

  useEffect(() => {
    chapterContent && setSelecting(null);
  }, [chapterContent]);

  return chapterContent ? (
    <>
      <Row className="justify-content-between align-items-end mb-3">
        <Col xs="auto">
          <h5 className="mt-4 mb-3">
            {chapterContent.id} - {chapterContent.translation}{" "}
            {`[${chapterContent && $t({ id: chapterContent.type })}]`} (
            {chapterContent.total_verses} {$t({ id: "verses" })})
          </h5>
        </Col>

        <Col xs="auto">
          <ButtonGroup>
            <Button
              variant="outline-primary"
              onClick={() => {
                if (selecting) {
                  setSelectedVersesString(selecting?.join(TA_SPLITTER_SYMBOL));
                  paginator?.setPage(1);
                  setSelecting(null);
                } else {
                  setSelecting(pickedVerses);
                }
              }}
            >
              {selecting ? "save" : pickedVerses.length > 0 ? "edit" : "start"}{" "}
              select
            </Button>

            {!selecting && pickedVerses.length > 0 && (
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSelectedVersesString(null, true);
                  paginator?.setPage(1);
                }}
              >
                reset select
              </Button>
            )}
          </ButtonGroup>
        </Col>
      </Row>

      {paginator && (
        <>
          <ComboPaginator paginator={paginator} hideSingle />

          {paginator.collection.map((i) => (
            <Card key={i.id} className="my-3 ps-2 border-1 p-1">
              {selecting === null ? (
                <Card.Text>
                  ({i.id}) {i.translation}
                </Card.Text>
              ) : (
                <FormCheck
                  onChange={(e) => {
                    const x = selecting.filter((x) => x !== i.id.toString());
                    if (e.target.checked) setSelecting([...x, i.id]);
                    else {
                      setSelecting(x);
                    }
                  }}
                  defaultChecked={
                    selecting?.findIndex((x) => x === i.id.toString()) >= 0
                  }
                  label={
                    <Card.Text>
                      ({i.id}) {i.translation}
                    </Card.Text>
                  }
                />
              )}
            </Card>
          ))}
        </>
      )}
    </>
  ) : (
    isLoading && (
      <Container className="pt-5 d-flex justify-content-center">
        <Spinner />
      </Container>
    )
  );
}
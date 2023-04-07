import { useCallback, useEffect, useState } from "react";
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

function getIdListByRange(id) {
  const xarr = id
    .toString()
    .split("-")
    .map((i) => parseInt(i));

  const [startID, endID] = [xarr[0], xarr[1] ?? xarr[0]];

  return [...Array(endID - startID + 1).keys()].map(
    (_, index) => startID + index
  );
}

function getStartAndEndItemsFromArray(arr) {
  return [arr[0], arr[arr.length - 1]];
}

function checkIfIdRangeSelected(idsArr, pickedVerses) {
  return idsArr
    .map((i) => parseInt(i))
    .every((id) => pickedVerses.includes(id));
}

function CheckItem({ pickedVerses, setPickedVerses, item }) {
  const idsArr = getIdListByRange(item.id);

  const [startID, endID] = getStartAndEndItemsFromArray(idsArr);

  return (
    <FormCheck
      onChange={(e) => {
        const prunedVerses = pickedVerses.filter(
          (x) => x < startID || x > endID
        );

        if (e.target.checked)
          setPickedVerses(
            [...prunedVerses, ...idsArr].sort((item1, item2) =>
              item1 > item2 ? 1 : -1
            )
          );
        else setPickedVerses(prunedVerses);
      }}
      checked={checkIfIdRangeSelected(idsArr, pickedVerses)}
      label={
        <Card.Text>
          ({item.id}) {item.translation}
        </Card.Text>
      }
    />
  );
}

export default function ShowChapterContent({
  selectedChapterID,
  selectedVersesString,
  setSelectedVersesString,
}) {
  const { $t, locale } = useIntl();
  const { chapterContent, setChapterContent, getChapter, isLoading } =
    useChapterContent();

  const [selecting, setSelecting] = useState(false);

  const [pickedVerses, setPickedVerses] = useState([]);

  const filterCallback = useCallback(
    (collection) =>
      pickedVerses.length > 0 && !selecting
        ? collection.filter((i) =>
            checkIfIdRangeSelected(getIdListByRange(i.id), pickedVerses)
          )
        : collection,
    [pickedVerses, selecting]
  );

  const paginator = usePagination(
    PAGE_LEN,
    chapterContent?.verses ?? [],
    filterCallback
  );

  useEffect(() => {
    const selectedVersesArr =
      selectedVersesString
        ?.split(TA_SPLITTER_SYMBOL)
        .filter((i) => !isNaN(parseInt(i)))
        .map((i) => parseInt(i))
        .sort() ?? [];
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
    chapterContent && setSelecting(false);
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
                  setSelectedVersesString(
                    pickedVerses?.join(TA_SPLITTER_SYMBOL)
                  );
                  paginator?.setPage(1);
                  setSelecting(false);
                } else {
                  setSelecting(true);
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
              {!selecting ? (
                <Card.Text>
                  ({i.id}) {i.translation}
                </Card.Text>
              ) : (
                <CheckItem
                  pickedVerses={pickedVerses}
                  setPickedVerses={setPickedVerses}
                  item={i}
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

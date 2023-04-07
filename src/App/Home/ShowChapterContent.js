import { useCallback, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  FormText,
  Row,
  Spinner,
} from "react-bootstrap";
import { useIntl } from "react-intl";
import ComboPaginator from "../../core/ComboPaginator";
import { getIdListByRange, isIdRangeIncluded } from "../../helpers/ranged_ids";
import useChapterContent from "../../helpers/useChapterContent";
import usePagination from "../../helpers/usePagination";
import VersesStr from "../../helpers/verses_str";
import CheckableVerseItem from "./CheckableVerseItem";

import {
  AiOutlineSelect as SelectIcon,
  AiOutlineSave as SaveIcon,
  AiFillEdit as EditIcon,
} from "react-icons/ai";
import { TiDeleteOutline as ResetIcon } from "react-icons/ti";
import { RxReset as CancelIcon } from "react-icons/rx";

const PAGE_LEN = 25;

const versesStrHelper = new VersesStr("_");

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
            isIdRangeIncluded(getIdListByRange(i.id), pickedVerses)
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
    window.scroll({ top: 0, left: 0, behavior: "auto" });
  }, [paginator?.page]);

  useEffect(() => {
    const selectedVersesArr =
      versesStrHelper.destructSelectedVersesString(selectedVersesString);
    setPickedVerses(selectedVersesArr.length > 0 ? selectedVersesArr : []);
    setSelecting(false);
  }, [selectedVersesString, selectedChapterID]);

  useEffect(() => {
    if (selectedChapterID >= 0 && selectedChapterID <= 114) {
      setChapterContent();
      getChapter(selectedChapterID, locale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChapterID, locale]);

  return chapterContent ? (
    <>
      <Row className="justify-content-between align-items-end mb-3 pt-4">
        <Col xs="auto">
          <h4 className="mb-0">
            {chapterContent.translation} :{chapterContent.id}
          </h4>
          <FormText>
            {`${chapterContent && $t({ id: chapterContent.type })}`} (
            {chapterContent.total_verses} {$t({ id: "verses" })})
          </FormText>
        </Col>

        <Col md="auto" xs={12} className="mt-1 text-start">
          <ButtonGroup>
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => {
                if (selecting) {
                  setSelectedVersesString(
                    versesStrHelper.constructSelectedVersesString(pickedVerses)
                  );
                  paginator?.setPage(1);
                }
                setSelecting((i) => !i);
              }}
            >
              {selecting ? (
                <SaveIcon />
              ) : pickedVerses.length > 0 ? (
                <EditIcon />
              ) : (
                <SelectIcon />
              )}{" "}
            </Button>

            {selecting ? (
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => {
                  const selectedVersesArr =
                    versesStrHelper.destructSelectedVersesString(
                      selectedVersesString
                    );
                  setPickedVerses(
                    selectedVersesArr.length > 0 ? selectedVersesArr : []
                  );
                  setSelecting(false);
                }}
              >
                <CancelIcon />
              </Button>
            ) : (
              pickedVerses.length > 0 && (
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => {
                    setSelectedVersesString(null, true);
                    paginator?.setPage(1);
                  }}
                >
                  <ResetIcon />
                </Button>
              )
            )}
          </ButtonGroup>
        </Col>
      </Row>

      {paginator && (
        <>
          {paginator.collection.map((i) => (
            <CheckableVerseItem
              key={i.id}
              className="my-3 ps-2 border-1 pb-1"
              pickedVerses={pickedVerses}
              setPickedVerses={setPickedVerses}
              item={i}
              checkable={selecting}
            />
          ))}
          <ComboPaginator paginator={paginator} hideSingle />
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

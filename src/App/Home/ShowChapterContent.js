import { useCallback, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  FormCheck,
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
  AiOutlineFilter as OnlyIcon,
} from "react-icons/ai";
import { TiDeleteOutline as ResetIcon } from "react-icons/ti";
import { RxReset as CancelIcon } from "react-icons/rx";

const PAGE_LEN = 25;

const versesStrHelper = new VersesStr("_");

const SelectingEnum = {
  NO: 0,
  YES: 1,
  YES_NARROW: 2,

  switchSelecting: (i) =>
    i === SelectingEnum.NO ? SelectingEnum.YES : SelectingEnum.NO,

  switchOnly: (i) => (i ? SelectingEnum.YES_NARROW : SelectingEnum.YES),
};

export default function ShowChapterContent({
  selectedChapterID,
  selectedVersesString,
  setSelectedVersesString,
}) {
  const { $t, locale } = useIntl();
  const { chapterContent, setChapterContent, getChapter, isLoading } =
    useChapterContent();

  const [selecting, setSelecting] = useState(SelectingEnum.NO);

  const [pickedVerses, setPickedVerses] = useState([]);

  const filterCallback = useCallback(
    (collection) =>
      pickedVerses.length > 0 &&
      (selecting === SelectingEnum.NO || selecting === SelectingEnum.YES_NARROW)
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
    setSelecting(SelectingEnum.NO);
  }, [selectedVersesString, selectedChapterID]);

  useEffect(() => {
    if (selectedChapterID >= 0 && selectedChapterID <= 114) {
      setChapterContent();
      getChapter(selectedChapterID, locale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChapterID, locale]);

  useEffect(() => {
    if (pickedVerses.length === 0 && selecting === SelectingEnum.YES_NARROW)
      setSelecting(SelectingEnum.YES);
  }, [pickedVerses, selecting]);

  const SelectionBtns = () => (
    <ButtonGroup>
      <Button
        size="sm"
        variant="outline-primary"
        onClick={() => {
          if (selecting !== SelectingEnum.NO) {
            setSelectedVersesString(
              versesStrHelper.constructSelectedVersesString(pickedVerses)
            );
            paginator?.setPage(1);
          }
          setSelecting(SelectingEnum.switchSelecting);
        }}
      >
        {selecting !== SelectingEnum.NO ? (
          <SaveIcon />
        ) : pickedVerses.length > 0 ? (
          <EditIcon />
        ) : (
          <SelectIcon />
        )}{" "}
      </Button>

      {selecting !== SelectingEnum.NO ? (
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
            setSelecting(SelectingEnum.NO);
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
  );

  return chapterContent ? (
    <>
      <Row className="mb-2 pt-4">
        <Col xs="auto">
          <h4 className="mb-0">
            {chapterContent.id}. {chapterContent.translation}
          </h4>
          <FormText>
            {`${chapterContent && $t({ id: chapterContent.type })}`} (
            {chapterContent.total_verses} {$t({ id: "verses" })})
          </FormText>
        </Col>
      </Row>

      {paginator && (
        <>
          <Row className="justify-content-between">
            <Col xs="auto">
              <Row className="align-items-end">
                <Col xs="auto pe-0">
                  <SelectionBtns />
                </Col>
                <Col xs="auto ms-3 p-0">
                  {selecting !== SelectingEnum.NO &&
                    pickedVerses.length > 0 && (
                      <FormCheck
                        size="sm"
                        type="switch"
                        label={<OnlyIcon />}
                        checked={selecting === SelectingEnum.YES_NARROW}
                        onChange={(e) => {
                          setSelecting(
                            SelectingEnum.switchOnly(e.target.checked)
                          );

                          if (e.target.checked) paginator?.setPage(1);
                        }}
                      />
                    )}
                </Col>
              </Row>
            </Col>

            <Col xs="auto">
              <ComboPaginator paginator={paginator} hideSingle />
            </Col>
          </Row>

          {paginator.collection.map((i) => (
            <CheckableVerseItem
              key={i.id}
              className="my-3 ps-2 border-1 pb-1"
              pickedVerses={pickedVerses}
              setPickedVerses={setPickedVerses}
              item={i}
              checkable={selecting !== SelectingEnum.NO}
            />
          ))}
          <Row className="justify-content-end">
            <Col xs="auto">
              <ComboPaginator paginator={paginator} hideSingle />
            </Col>
          </Row>
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

import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  CloseButton,
  Col,
  Container,
  FormCheck,
  FormText,
  Row,
  Spinner,
} from "react-bootstrap";
import { FormattedMessage, useIntl } from "react-intl";
import { AiOutlineSearch as SearchIcon } from "react-icons/ai";
import {
  TbSelect as SelectIcon,
  TbEdit as EditIcon,
  TbFilterOff as ResetIcon,
} from "react-icons/tb";
import { IoMdCheckmark as SaveIcon } from "react-icons/io";
import { BiHide as OnlyIcon } from "react-icons/bi";
// import { RxCross2 as CancelIcon } from "react-icons/rx";

import ComboPaginator from "../../../core/ComboPaginator";
import {
  getIdListByRange,
  isIdRangeIncluded,
} from "../../../helpers/ranged_ids";
import { SelectingEnum } from "../../../constants";
import { randomDifferentIntsFromInterval } from "../../../helpers/randoms";
import useChapterContent from "../../../helpers/useChapterContent";
import usePagination from "../../../helpers/usePagination";
import VersesStr from "../../../helpers/verses_str";
import CheckableVerseItem from "./CheckableVerseItem";
import SearchVersesModal from "./SearchVersesModal";

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

  const [selecting, setSelecting] = useState(SelectingEnum.NO);

  const [searchTerm, setSearchTerm] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const [pickedVerses, setPickedVerses] = useState([]);

  const filterCallback = useCallback(
    (collection) => {
      const filteredCollection =
        pickedVerses.length > 0 &&
        (selecting === SelectingEnum.NO ||
          selecting === SelectingEnum.YES_NARROW)
          ? collection.filter((i) =>
              isIdRangeIncluded(getIdListByRange(i.id), pickedVerses)
            )
          : collection;

      return searchTerm
        ? filteredCollection.filter((i) =>
            i.translation.toLowerCase().includes(searchTerm)
          )
        : filteredCollection;
    },
    [pickedVerses, selecting, searchTerm]
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
      // setSearchTerm(null);
      getChapter(selectedChapterID, locale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChapterID, locale]);

  useEffect(() => {
    if (pickedVerses.length === 0 && selecting === SelectingEnum.YES_NARROW)
      setSelecting(SelectingEnum.YES);
  }, [pickedVerses, selecting]);

  // shows random verses
  useEffect(() => {
    if (chapterContent) {
      const randQuantity =
        pickedVerses.length === 1 &&
        parseInt(pickedVerses[0]) < 0 &&
        Math.abs(parseInt(pickedVerses[0]));
      if (randQuantity) {
        const versesAll = chapterContent.verses;

        const randIDIndexes = randomDifferentIntsFromInterval(
          randQuantity,
          0,
          versesAll.length - 1
        );

        let arr = [];
        for (let i = 0; i < randIDIndexes.length; i++) {
          const randID_item = versesAll[randIDIndexes[i]].id;
          arr.push(...getIdListByRange(randID_item));
        }
        arr = arr.sort((m, n) => (m > n ? 1 : -1));
        // console.log(arr);
        paginator?.setPage(1);
        setPickedVerses(arr);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedVerses, chapterContent]);

  const SelectionBtns = () => (
    <ButtonGroup>
      <Button
        size="sm"
        variant="outline-secondary"
        onClick={() => setShowSearchModal(true)}
      >
        <SearchIcon />
      </Button>

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

      {selecting !== SelectingEnum.NO
        ? null
        : // <Button
          //   size="sm"
          //   variant="outline-secondary"
          //   onClick={() => {
          //     const selectedVersesArr =
          //       versesStrHelper.destructSelectedVersesString(
          //         selectedVersesString
          //       );
          //     setPickedVerses(
          //       selectedVersesArr.length > 0 ? selectedVersesArr : []
          //     );
          //     setSelecting(SelectingEnum.NO);
          //     paginator?.setPage(1)
          //   }}
          // >
          //   <CancelIcon />
          // </Button>
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
          )}
    </ButtonGroup>
  );

  return chapterContent ? (
    <>
      <SearchVersesModal
        onHide={setShowSearchModal}
        show={showSearchModal}
        filterText={searchTerm}
        setFilterText={(termStr) => {
          if (termStr.startsWith("!r")) {
            const randQuantity = parseInt(termStr.substring(2));
            if (!isNaN(randQuantity)) {
              paginator?.setPage(1);
              setSelectedVersesString(-1 * randQuantity);
              setShowSearchModal(false);
            }
          } else if (termStr) {
            paginator?.setPage(1);
            setShowSearchModal(false);
            setSearchTerm(termStr);
          }
        }}
      />
      <Row className="mb-2 pt-4 justify-content-between">
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
                <Col xs="auto ms-1 p-0">
                  {selecting !== SelectingEnum.NO &&
                    pickedVerses.length > 0 && (
                      <FormCheck
                        size="sm"
                        type="switch"
                        label={<OnlyIcon className="p-0" />}
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

          {searchTerm && (
            <div className="mt-2">
              <FormText>
                <FormattedMessage id="search_results" />{" "}
                <Badge
                  className="bg-secondary text-light"
                  onClick={() => {
                    paginator?.setPage(1);
                    setSearchTerm(null);
                  }}
                >
                  {searchTerm} <CloseButton variant="white" />
                </Badge>
              </FormText>
            </div>
          )}

          {paginator.collection.map((i) => (
            <CheckableVerseItem
              key={i.id}
              className="my-3 ps-2 border-1 pb-1"
              pickedVerses={pickedVerses}
              setPickedVerses={setPickedVerses}
              item={i}
              checkable={selecting !== SelectingEnum.NO}
              searchTerm={searchTerm}
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

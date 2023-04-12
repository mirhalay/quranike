import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { randomIntFromInterval } from "../../../helpers/randoms";
import ComboChapters from "./ComboChapters";
import chaptersJSON from "../../../chapters.json";
import SearchChaptersModal from "./SearchChaptersModal";
import { TYPE_ENUM } from "../../../constants";

const INIT_TYPE = TYPE_ENUM.any;

export default function ChapterFilter({
  selectedChapterID,
  setSelectedChapterID,
}) {
  const [chapters] = useState(
    chaptersJSON.sort((j, k) => (j.reveal_order > k.reveal_order ? 1 : -1))
  );
  const [showSearchModal, setShowSearchModal] = useState();

  const filterTypeState = useState(INIT_TYPE);

  const typeFilterValue = filterTypeState[0];

  const predEqualType =
    typeFilterValue === TYPE_ENUM.any
      ? null
      : (i) => TYPE_ENUM[i.type] === typeFilterValue;

  useEffect(() => {
    if (selectedChapterID < 0) {
      setSelectedChapterID(randomIntFromInterval(1, 114), false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChapterID]);

  const typelyChapters = predEqualType
    ? chapters.filter(predEqualType)
    : chapters;

  const chapterModal = (
    <SearchChaptersModal
      onHide={setShowSearchModal}
      chapterList={showSearchModal && typelyChapters}
      filterTypeState={filterTypeState}
      onChapterSelected={function (chapterID) {
        if (chapterID) {
          setShowSearchModal(false);
          setSelectedChapterID(chapterID);
        }
      }}
    />
  );

  return (
    <Container className="px-md-4 px-xs-2">
      <div className="border pt-2 pb-4 ps-3 ps-md-5 pe-2">
        <Row className="align-items-center">
          <Col md="auto" className="ps-md-4">
            <ComboChapters
              selectedChapterID={selectedChapterID}
              setSelectedChapterID={setSelectedChapterID}
              chapters={chapters}
              showChaptersModal={() => setShowSearchModal(true)}
            />
          </Col>
        </Row>
      </div>
      {chapterModal}
    </Container>
  );
}

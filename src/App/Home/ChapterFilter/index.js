import { Col, Container, Form, Row, Stack } from "react-bootstrap";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import CheckType from "./CheckType";
import ComboChapters from "./ComboChapters";

export default function ChapterFilter({ selectedChapterChanged }) {
  const [selectedType, setSelectedType] = useState({
    medinan: true,
    meccan: true,
  });
  const [selectedChapter, setSelectedChapter] = useState(0);

  useEffect(() => {
    selectedChapterChanged(selectedChapter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChapter]);

  return (
    <Container className="px-md-4 px-xs-2">
      <Form className="border pt-3 pb-4 ps-3 ps-md-5">
        <Row className="align-items-center">
          <Col md="auto">
            <Stack direction="horizontal">
              <Form.Text className="me-3">
                <FormattedMessage id="type" />:
              </Form.Text>
              <CheckType
                selectedType={selectedType}
                onChange={(i) => {
                  setSelectedChapter(0);
                  setSelectedType({
                    ...selectedType,
                    [i.target.value]: i.target.checked,
                  });
                }}
              />
            </Stack>
          </Col>

          <Col md={4} className="ps-md-4">
            <Stack direction="horizontal" className="mt-3 align-items-start">
              <Form.Text className="me-3">
                <FormattedMessage id="chapter" />:
              </Form.Text>
              <Row className="ms-1">
                <ComboChapters
                  selectedType={selectedType}
                  selectedChapter={selectedChapter}
                  setSelectedChapter={setSelectedChapter}
                />
              </Row>
            </Stack>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

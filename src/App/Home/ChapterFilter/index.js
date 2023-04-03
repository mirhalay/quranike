import { Col, Container, Form, Row, Stack } from "react-bootstrap";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import CheckType from "./CheckType";
import ComboChapters from "./ComboChapters";

export default function ChapterFilter({
  selectedChapterID,
  setSelectedChapterID,
}) {
  const [selectedType, setSelectedType] = useState({
    medinan: true,
    meccan: true,
  });

  return (
    <Container className="px-md-4 px-xs-2">
      <Form className="border pt-3 pb-4 ps-3 ps-md-5 pe-2">
        <Row className="align-items-center">
          <Col md="auto">
            <Stack direction="horizontal">
              <Form.Text className="me-3">
                <FormattedMessage id="type" />:
              </Form.Text>
              <CheckType
                selectedType={selectedType}
                onChange={(i) => {
                  setSelectedType({
                    ...selectedType,
                    [i.target.value]: i.target.checked,
                  });
                }}
              />
            </Stack>
          </Col>

          <Col md={6} className="ps-md-4">
            <Stack direction="horizontal" className="mt-3 align-items-start">
              <Form.Text className="me-2">
                <FormattedMessage id="chapter" />:
              </Form.Text>
              <Row>
                <ComboChapters
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  selectedChapterID={selectedChapterID}
                  setSelectedChapterID={setSelectedChapterID}
                />
              </Row>
            </Stack>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

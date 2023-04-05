import { Col, Container, Form, Row, Stack } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import ComboChapters from "./ComboChapters";

export default function ChapterFilter({
  selectedChapterID,
  setSelectedChapterID,
}) {
  return (
    <Container className="px-md-4 px-xs-2">
      <Form className="border pt-3 pb-4 ps-3 ps-md-5 pe-2">
        <Row className="align-items-center">
          <Col md={6} className="ps-md-4">
            <Stack direction="horizontal" className="mt-3 align-items-start">
              <Form.Text className="me-2">
                <FormattedMessage id="chapter" />:
              </Form.Text>
              <Row>
                <ComboChapters
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
import {
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Stack,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import chaptersJSON from "../../chapters.json";
import { FormattedMessage, useIntl } from "react-intl";

function CheckType({ selectedType, onChange }) {
  const { $t } = useIntl();

  return (
    <Form.Group>
      <Stack direction="horizontal" className="d-flex align-items-end pt-2">
        <Form.Check
          label={$t({ id: "meccan" })}
          checked={selectedType.meccan}
          onChange={onChange}
          value="meccan"
          className="me-2"
        />

        <Form.Check
          label={$t({ id: "medinan" })}
          checked={selectedType.medinan}
          onChange={onChange}
          value="medinan"
        />
      </Stack>
    </Form.Group>
  );
}

function ComboChapters({ selectedType, selectedChapter, setSelectedChapter }) {
  const [chapters] = useState(
    chaptersJSON.sort((j, k) => (j.reveal_order > k.reveal_order ? 1 : -1))
  );
  const { locale, $t } = useIntl();

  const chaptersFilteredByType = chapters?.filter((i) => selectedType[i.type]);

  return (
    <Form.Select
      value={selectedChapter}
      onChange={(i) => setSelectedChapter(i.target.value)}
    >
      <option value={0}>[{$t({ id: "not_selected" })}]</option>
      {chapters &&
        chaptersFilteredByType.map((i) => (
          <option key={i.id} value={i.id}>
            {i[locale.substring(0, 2)]} ({i.id})
          </option>
        ))}
    </Form.Select>
  );
}

// const randomIntFromInterval = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

function useChapterContent() {
  const { locale } = useIntl();
  const [chapterContent, setChapterContent] = useState(null);

  useEffect(() => {
    setChapterContent(null);
  }, [locale]);

  const chapterGetter = (chapter) => {
    setChapterContent(undefined);
    axios
      .get(`chapters/${[locale.substring(0, 2)]}/${chapter}.json`)
      .then(({ status, data }) => {
        status === 200 && setChapterContent(data);
      });
  };

  useEffect(() => {
    if (chapterContent) chapterGetter(chapterContent.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return {
    chapterContent,
    isLoading: chapterContent === undefined,
    setChapterContent,
    getChapter: (selectedChapter) => {
      if (selectedChapter > 0) {
        chapterGetter(selectedChapter);
      } else setChapterContent(null);
    },
  };
}

function ShowChapterContent({ chapterContent, isLoading }) {
  const { $t } = useIntl();
  const typeLabel = chapterContent && $t({ id: chapterContent.type });

  return chapterContent ? (
    <>
      <h5 className="mt-4 mb-3">
        {chapterContent.translation} {`[${typeLabel}]`}
      </h5>

      {chapterContent.verses.map((i) => (
        <Card key={i.id} className="my-3 ps-2 border-1">
          <Card.Text className="text-dark">
            {i.id} - {i.translation}
          </Card.Text>
        </Card>
      ))}
    </>
  ) : (
    isLoading && (
      <Container className="p-2">
        <Spinner />
      </Container>
    )
  );
}

export default function Home() {
  const [selectedType, setSelectedType] = useState({
    medinan: true,
    meccan: true,
  });
  const [selectedChapter, setSelectedChapter] = useState(0);
  const { chapterContent, setChapterContent, getChapter, isLoading } =
    useChapterContent();

  useEffect(() => {
    setChapterContent();
    getChapter(selectedChapter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChapter]);

  return (
    <div className="p-3">
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

      <ShowChapterContent
        isLoading={isLoading}
        chapterContent={chapterContent}
      />
    </div>
  );
}

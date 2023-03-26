import { Card, Container, Form, Row, Spinner, Stack } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

function CheckType({ selectedType, onChange }) {
  return (
    <Form.Group>
      <Stack direction="horizontal" className="d-flex align-items-end">
        <Form.Check
          label="Meccan"
          checked={selectedType.meccan}
          onChange={onChange}
          value="meccan"
          className="me-2"
        />

        <Form.Check
          label="Medinan"
          checked={selectedType.medinan}
          onChange={onChange}
          value="medinan"
        />
      </Stack>
    </Form.Group>
  );
}

function ComboChapters({ selectedType, selectedChapter, setSelectedChapter }) {
  const [chapters, setChapters] = useState();

  useEffect(() => {
    axios
      .get("tr-chapters.json")
      .then(({ status, data }) => status === 200 && setChapters(data));
  }, []);

  const chaptersFilteredByType = chapters?.filter((i) => selectedType[i.type]);

  return (
    <Form.Select
      value={selectedChapter}
      onChange={(i) => setSelectedChapter(i.target.value)}
    >
      <option value={0}>[Not Selected]</option>
      {chapters &&
        chaptersFilteredByType.map((i) => (
          <option key={i.id} value={i.id}>
            {i.transliteration} ({i.id})
          </option>
        ))}
    </Form.Select>
  );
}

// const randomIntFromInterval = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

function useChapterContent() {
  const [chapterContent, setChapterContent] = useState(null);

  return {
    chapterContent,
    isLoading: chapterContent === undefined,
    setChapterContent,
    getChapter: (selectedChapter) => {
      if (selectedChapter > 0) {
        setChapterContent(undefined);
        axios
          .get(`chapters/en/${selectedChapter}.json`)
          .then(({ status, data }) => {
            status === 200 && setChapterContent(data);
          });
      } else setChapterContent(null);
    },
  };
}

function ShowChapterContent({ chapterContent, isLoading }) {
  return chapterContent ? (
    <>
      <h5 className="mt-4 mb-2">
        {chapterContent.translation} {`[${chapterContent.type}]`}
      </h5>

      <ol>
        {chapterContent.verses.map((i) => (
          <Card key={i.id} className="my-2">
            <li className="py-1 ps-1">
              <span className="text-dark">{i.translation}</span>
            </li>
          </Card>
        ))}
      </ol>
    </>
  ) : isLoading ? (
    <Container className="p-2">
      <Spinner />
    </Container>
  ) : (
    <Container className="p-2">
      <p>please select a chapter to show.</p>
    </Container>
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
    <Container className="p-5">
      <Form className="px-2 border p-3">
        <Container>
          <Stack direction="horizontal">
            <Form.Text className="me-3">Type: </Form.Text>
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

          <Stack direction="horizontal" className="mt-3">
            <Form.Text className="me-3">Chapter: </Form.Text>
            <Row className="ms-1">
              <ComboChapters
                selectedType={selectedType}
                selectedChapter={selectedChapter}
                setSelectedChapter={setSelectedChapter}
              />
            </Row>
          </Stack>
        </Container>
      </Form>

      <ShowChapterContent
        isLoading={isLoading}
        chapterContent={chapterContent}
      />
    </Container>
  );
}

import { Card, Container, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

function ComboType({ selectedType, onChange }) {
  return (
    <Form.Select onChange={onChange} value={selectedType}>
      <option value={0}>[Any]</option>
      <option value="meccan">Meccan</option>
      <option value="medinan">Medinan</option>
    </Form.Select>
  );
}

function ComboChapters({ selectedType, selectedChapter, setSelectedChapter }) {
  const [chapters, setChapters] = useState();

  useEffect(() => {
    axios
      .get("quranike/tr-chapters.json")
      .then(({ status, data }) => status === 200 && setChapters(data));
  }, []);

  const chaptersFilteredByType = chapters?.filter(
    (i) => parseInt(selectedType) === 0 || i.type === selectedType
  );

  return (
    chapters && (
      <Form.Select
        value={selectedChapter}
        onChange={(i) => setSelectedChapter(i.target.value)}
      >
        <option value={0}>[Not Selected]</option>
        {chaptersFilteredByType.map((i) => (
          <option key={i.id} value={i.id}>
            {i.translation} ({i.id}) {!selectedType && `[${i.type}]`}
          </option>
        ))}
      </Form.Select>
    )
  );
}

// const randomIntFromInterval = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

function useChapterContent() {
  const [chapterContent, setChapterContent] = useState();

  return {
    chapterContent,
    setChapterContent,
    getChapter: (selectedChapter) => {
      selectedChapter > 0 &&
        axios
          .get(`quranike/chapters/tr/${selectedChapter}.json`)
          .then(({ status, data }) => {
            status === 200 && setChapterContent(data);
          });
    },
  };
}

export default function Home() {
  const [selectedType, setSelectedType] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const { chapterContent, setChapterContent, getChapter } = useChapterContent();

  useEffect(() => {
    setChapterContent();
    getChapter(selectedChapter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChapter]);

  return (
    <Container className="p-5">
      <Form className="px-5">
        <ComboType
          selectedType={selectedType}
          onChange={(i) => {
            setSelectedChapter(0);
            setSelectedType(i.target.value);
          }}
        />

        <ComboChapters
          selectedType={selectedType}
          selectedChapter={selectedChapter}
          setSelectedChapter={setSelectedChapter}
        />
      </Form>

      <Container className="p-3">
        <h5>{chapterContent?.translation}</h5>

        <ol>
          {chapterContent?.verses.map((i) => (
            <Card key={i.id} className="my-2">
              <li className="p-2">{i.translation}</li>
            </Card>
          ))}
        </ol>
      </Container>
    </Container>
  );
}

import { Card, Container, Spinner } from "react-bootstrap";
import { useIntl } from "react-intl";

export default function ShowChapterContent({ chapterContent, isLoading }) {
  const { $t } = useIntl();
  const typeLabel = chapterContent && $t({ id: chapterContent.type });

  return chapterContent ? (
    <>
      <h5 className="mt-4 mb-3">
        {chapterContent.translation} {`[${typeLabel}]`}
      </h5>

      {chapterContent.verses.map((i) => (
        <Card key={i.id} className="my-3 ps-2 border-1 p-1">
          <Card.Text className="text-dark">
            ({i.id}) {i.translation}
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

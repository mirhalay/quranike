import { useEffect } from "react";
import { Card, Container, Spinner } from "react-bootstrap";
import { useIntl } from "react-intl";
import ComboPaginator from "../../core/ComboPaginator";
import useChapterContent from "../../helpers/useChapterContent";
import usePagination from "../../helpers/usePagination";

const PAGE_LEN = 25;

export default function ShowChapterContent({ selectedChapterID }) {
  const { $t } = useIntl();
  const { chapterContent, setChapterContent, getChapter, isLoading } =
    useChapterContent();

  useEffect(() => {
    setChapterContent();
    getChapter(selectedChapterID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChapterID]);

  const paginator = usePagination(PAGE_LEN, chapterContent?.verses);

  return chapterContent ? (
    <>
      <h5 className="mt-4 mb-3">
        {chapterContent.translation}{" "}
        {`[${chapterContent && $t({ id: chapterContent.type })}]`} (
        {chapterContent.total_verses} {$t({ id: "verses" })})
      </h5>

      {paginator && (
        <>
          <ComboPaginator paginator={paginator} />

          {paginator.collection.map((i) => (
            <Card key={i.id} className="my-3 ps-2 border-1 p-1">
              <Card.Text>
                ({i.id}) {i.translation}
              </Card.Text>
            </Card>
          ))}
        </>
      )}
    </>
  ) : (
    isLoading && (
      <Container className="p-2">
        <Spinner />
      </Container>
    )
  );
}

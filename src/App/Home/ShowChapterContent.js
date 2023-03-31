import { Card, Container, Spinner } from "react-bootstrap";
import { useIntl } from "react-intl";
import ComboPaginator from "../../core/ComboPaginator";
import usePagination from "../../helpers/usePagination";

const PAGE_LEN = 25;

export default function ShowChapterContent({ chapterContent, isLoading }) {
  const { $t } = useIntl();
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

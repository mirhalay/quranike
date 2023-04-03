import { Button, FormSelect, Stack } from "react-bootstrap";
import { FaArrowLeft as PrevIcon } from "react-icons/fa";
import { FaArrowRight as NextIcon } from "react-icons/fa";
export default function ComboPaginator({ paginator, hideSingle = false }) {
  return (
    paginator &&
    (!hideSingle || (hideSingle && paginator?.pageCount > 1)) && (
      <Stack direction="horizontal">
        <Button variant="outline-primary" onClick={paginator?.back}>
          <PrevIcon />
        </Button>
        <FormSelect
          className="mx-2"
          style={{ maxWidth: 70 }}
          onChange={(i) => paginator?.setPage(parseInt(i.target.value))}
          value={paginator?.page}
        >
          {paginator.pagesArray?.map((i) => (
            <option key={i}>{i}</option>
          ))}
          ;
        </FormSelect>
        <Button variant="outline-primary" onClick={paginator?.next}>
          <NextIcon />
        </Button>
      </Stack>
    )
  );
}

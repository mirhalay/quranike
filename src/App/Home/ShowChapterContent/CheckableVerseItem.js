import { Card, FormCheck, FormText } from "react-bootstrap";
import {
  getIdListByRange,
  getStartAndEndItemsFromArray,
  isIdRangeIncluded,
} from "../../../helpers/ranged_ids";

function HighlightedText({ text, highlight }) {
  if (!highlight) return <span>{text}</span>;

  const parts = text.split(new RegExp(`(${highlight})`, "gi"));

  return (
    <span>
      {parts.map((part, i) => (
        <span
          key={i}
          style={
            part.toLowerCase() === highlight.toLowerCase()
              ? {
                  fontWeight: "bold",
                  backgroundColor: "yellow",
                  color: "black",
                }
              : {}
          }
        >
          {part}
        </span>
      ))}
    </span>
  );
}

export default function CheckableVerseItem({
  pickedVerses,
  setPickedVerses,
  item,
  checkable = true,
  searchTerm,
  ...props
}) {
  const VerseItem = () => (
    <span className="mb-0 pb-0">
      <FormText>({item.id})</FormText>{" "}
      {<HighlightedText text={item?.translation} highlight={searchTerm} />}
    </span>
  );

  const idsArr = getIdListByRange(item.id);

  const [startID, endID] = getStartAndEndItemsFromArray(idsArr);

  return (
    <Card {...props}>
      {checkable ? (
        <FormCheck
          onChange={(e) => {
            const prunedVerses = pickedVerses.filter(
              (x) => x < startID || x > endID
            );

            if (e.target.checked)
              setPickedVerses(
                [...prunedVerses, ...idsArr].sort((item1, item2) =>
                  item1 > item2 ? 1 : -1
                )
              );
            else setPickedVerses(prunedVerses);
          }}
          checked={isIdRangeIncluded(idsArr, pickedVerses)}
          label={<VerseItem />}
        />
      ) : (
        <VerseItem />
      )}
    </Card>
  );
}

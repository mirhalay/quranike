import { Card, FormCheck, FormText } from "react-bootstrap";
import {
  getIdListByRange,
  getStartAndEndItemsFromArray,
  isIdRangeIncluded,
} from "../../helpers/ranged_ids";

export default function CheckableVerseItem({
  pickedVerses,
  setPickedVerses,
  item,
  checkable = true,
  ...props
}) {
  function VerseItem({ item }) {
    return (
      <span className="mb-0 pb-0">
        <FormText>({item.id})</FormText> {item.translation}
      </span>
    );
  }

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
          label={<VerseItem item={item} />}
        />
      ) : (
        <VerseItem item={item} />
      )}
    </Card>
  );
}

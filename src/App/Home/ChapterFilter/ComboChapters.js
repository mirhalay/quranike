import { useState } from "react";
import { FormSelect } from "react-bootstrap";
import { useIntl } from "react-intl";
import chaptersJSON from "../../../chapters.json";

export default function ComboChapters({
  selectedType,
  selectedChapter,
  setSelectedChapter,
}) {
  const [chapters] = useState(
    chaptersJSON.sort((j, k) => (j.reveal_order > k.reveal_order ? 1 : -1))
  );
  const { locale, $t } = useIntl();

  const chaptersFilteredByType = chapters?.filter((i) => selectedType[i.type]);

  return (
    <FormSelect
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
    </FormSelect>
  );
}

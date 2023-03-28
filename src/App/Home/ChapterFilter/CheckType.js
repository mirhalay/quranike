import { FormCheck, FormGroup, Stack } from "react-bootstrap";
import { useIntl } from "react-intl";

export default function CheckType({ selectedType, onChange }) {
  const { $t } = useIntl();

  return (
    <FormGroup>
      <Stack direction="horizontal" className="d-flex align-items-end pt-2">
        <FormCheck
          label={$t({ id: "meccan" })}
          checked={selectedType.meccan}
          onChange={onChange}
          value="meccan"
          className="me-2"
        />

        <FormCheck
          label={$t({ id: "medinan" })}
          checked={selectedType.medinan}
          onChange={onChange}
          value="medinan"
        />
      </Stack>
    </FormGroup>
  );
}

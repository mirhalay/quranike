import { FormCheck, FormGroup, FormText, Stack } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import { TYPE_ENUM } from "../../../constants";

export default function CheckType({ filterTypeState, ...props }) {
  const [filterType, setFilterType] = filterTypeState;

  const onChange = (i) => {
    const value = parseInt(i.target.value) * (i.target.checked ? 1 : -1);

    const newVal = filterType + value;

    if (newVal > 0) setFilterType(newVal);
    else setFilterType(TYPE_ENUM.any - filterType);
  };

  return (
    <FormGroup {...props}>
      <Stack direction="horizontal" className="d-flex align-items-end pt-2">
        <FormCheck
          label={
            <FormText>
              <FormattedMessage id="meccan" />
            </FormText>
          }
          checked={
            filterType === TYPE_ENUM.meccan || filterType === TYPE_ENUM.any
          }
          onChange={onChange}
          value={TYPE_ENUM.meccan}
          className="me-2"
        />

        <FormCheck
          label={
            <FormText>
              <FormattedMessage id="medinan" />
            </FormText>
          }
          checked={
            filterType === TYPE_ENUM.medinan || filterType === TYPE_ENUM.any
          }
          onChange={onChange}
          value={TYPE_ENUM.medinan}
        />
      </Stack>
    </FormGroup>
  );
}

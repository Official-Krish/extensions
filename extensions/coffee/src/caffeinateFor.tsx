import { Action, ActionPanel, Form, popToRoot, showToast, Toast } from "@raycast/api";
import { startCaffeinate, deviceName } from "./utils";

async function caffeinateFor(values: { hours?: string; minutes?: string; seconds?: string }) {
  const { hours, minutes, seconds } = values;
  const hasValue = hours || minutes || seconds;

  if (!hasValue) {
    await showToast(Toast.Style.Failure, "No values set for caffeinate length");
    return;
  }

  const validInput =
    (!hours || (Number.isInteger(Number(hours)) && Number(hours) >= 0)) &&
    (!minutes || (Number.isInteger(Number(minutes)) && Number(minutes) >= 0)) &&
    (!seconds || (Number.isInteger(Number(seconds)) && Number(seconds) >= 0));

  if (!validInput) {
    await showToast(Toast.Style.Failure, "Please ensure all fields are whole numbers");
    return;
  }

  const totalSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  const formattedTime = `${hours ? `${hours}h` : ""}${minutes ? `${minutes}m` : ""}${seconds ? `${seconds}s` : ""}`;

  await startCaffeinate(
    { menubar: true, status: true },
    `Caffeinating your ${deviceName()} for ${formattedTime}`,
    `-t ${totalSeconds}`,
    { kind: "for", endsAt: new Date(Date.now() + totalSeconds * 1000).toISOString() },
  );
}

export default function Command() {
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Caffeinate"
            onSubmit={(values: { hours?: string; minutes?: string; seconds?: string }) => {
              popToRoot();
              caffeinateFor({ hours: values.hours, minutes: values.minutes, seconds: values.seconds });
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="hours" title="Hours" placeholder="0" />
      <Form.TextField id="minutes" title="Minutes" placeholder="0" />
      <Form.TextField id="seconds" title="Seconds" placeholder="0" />
    </Form>
  );
}

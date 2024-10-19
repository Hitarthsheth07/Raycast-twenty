import React from "react";
import { List, Image, Icon, ActionPanel, Action, Toast, showToast } from "@raycast/api";
import { useGetObjects } from "./hooks/use-objects";
import CreateRecordForm from "./create-record";

export default function ListObjects() {
  const { objects, isLoading, error, loadMore, hasMore } = useGetObjects();

  React.useEffect(() => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to load Objects",
        message: error.message,
      });
    }
  }, [error]);

  return (
    <List isLoading={isLoading} isShowingDetail>
      {objects.map((object) => {

        return (
          <List.Item
            // FEAT: Add more action items like opening object in browser
            key={object.id}
            id={object.id}
            title={object.namePlural}
            subtitle="object"
            actions={
              <ActionPanel>
                <Action.Push
                // FEAT: Add a detail block to show an example object
                  icon={Icon.BlankDocument}
                  title="Add object"
                  shortcut={{ modifiers: ["cmd"], key: "o" }}
                  target={<CreateRecordForm node={objects} objectName={object.namePlural}/>}
                />
                <Action.CopyToClipboard
                  title="Copy object Name"
                  content={object.namePlural}
                  shortcut={{ modifiers: ["cmd"], key: "c" }}
                />
              </ActionPanel>
            }
            icon={{
              source: object.icon,
              mask: Image.Mask.Circle,
            }}
          />
        );
      })}
    </List>
  );
}

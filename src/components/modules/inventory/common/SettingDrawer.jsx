import { useOutletContext } from "react-router";
import { ActionIcon, Box, ScrollArea, Drawer, Flex } from "@mantine/core";

import { IconX } from "@tabler/icons-react";
import _SettingsForm from "./_SettingsForm.jsx";

function SettingDrawer(props) {
  const { settingDrawer, setSettingDrawer, module } = props;
  const { mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight; //TabList height 104
  const closeDrawer = () => {
    setSettingDrawer(false);
  };

  return (
    <>
      <Drawer.Root
        opened={settingDrawer}
        position="right"
        onClose={closeDrawer}
        size={"30%"}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <ScrollArea
            h={height + 100}
            scrollbarSize={2}
            type="never"
            bg={"gray.1"}
          >
            <Flex
              mih={40}
              gap="md"
              justify="flex-end"
              align="center"
              direction="row"
              wrap="wrap"
            >
              <ActionIcon
                mr={"sm"}
                radius="xl"
                color="grey.6"
                size="md"
                variant="outline"
                onClick={closeDrawer}
              >
                <IconX style={{ width: "80%", height: "80%" }} stroke={1.5} />
              </ActionIcon>
            </Flex>
            <Box ml={2} mr={2} mb={0}>
              <_SettingsForm
                module={module}
                setSettingDrawer={setSettingDrawer}
              />
            </Box>
          </ScrollArea>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}

export default SettingDrawer;

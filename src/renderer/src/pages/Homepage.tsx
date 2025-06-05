import { IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";
import { FaTasks, FaUser } from "react-icons/fa";
import APIUsersList from "../components/apiUsers/APIUsersList";
import { APIUserZodSchema, CreateAPIUserZodSchema } from "@/shared/schemas";
import ConfirmationDialog from "../components/generic/ConfirmationDialog";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { VehicleWithAPIUserZodSchema } from "@/shared/schemas/vehicle";
import VehicleList from "../components/vehicles/VehicleList";
import AddAPIUserDialog from "../components/apiUsers/AddAPIUserDialog";

function Homepage(): JSX.Element {
  const [apiUsers, setAPIUsers] = useState<APIUserZodSchema[]>([]);
  const [reminders, setReminders] = useState<VehicleWithAPIUserZodSchema[]>([]);
  const [isAddAPIUserDialogVisible, setIsAddAPIUserDialogVisible] = useState<boolean>(false);
  const [isConfirmationDialogVisible, setIsConfirmationDialogVisible] = useState<boolean>(false);
  const [confirmationDialogTitle, setConfirmationDialogTitle] = useState<string>("");
  const [confirmationDialogDescription, setConfirmationDialogDescription] = useState<string>("");
  const [confirmationDialogId, setConfirmationDialogId] = useState<number | undefined>();

  // Use Toast
  const { toast } = useToast();

  // Send IPC request to the main process to fetch the API users from the database once the component mounts
  useEffect(() => {
    window.electron.ipcRenderer.send("fetchAPIUsers");
  }, []);

  // Receive APIUsers from the main process
  useEffect(() => {
    const handleFetchAPIUsersReply = (event: IpcRendererEvent, response): void => {
      setAPIUsers(response.results);
    };

    // Add the listener on mount
    const fetchAPIUsersReplyListener = window.electron.ipcRenderer.on(
      "fetchAPIUsersReply",
      handleFetchAPIUsersReply
    );

    // Remove the listener on unmount
    return (): void => {
      fetchAPIUsersReplyListener();
    };
  }, []);

  // Send IPC request to the main process to fetch the reminders from the database once the component mounts
  useEffect(() => {
    window.electron.ipcRenderer.send("fetchRemindersWithAPIUsers");
  }, []);

  // Receive reminders from the main process
  useEffect(() => {
    const handleFetchRemindersReply = (event: IpcRendererEvent, response): void => {
      setReminders(response.results);
    };

    // Add the listener on mount
    const fetchRemindersReplyListener = window.electron.ipcRenderer.on(
      "fetchRemindersReply",
      handleFetchRemindersReply
    );

    // Remove the listener on unmiunt
    return (): void => {
      fetchRemindersReplyListener();
    };
  }, []);

  // Display the existing APIUser dialog
  const handleOpenExistingAPIUserDialog = (): void => {
    setIsAddAPIUserDialogVisible(true);
  };

  // Close the Add API User Dialog
  const handleCloseDialog = (): void => {
    setIsAddAPIUserDialogVisible(false);
  };

  // Display the confirmation dialog
  const showConfirmationDialog = (id: number): void => {
    setConfirmationDialogTitle(`Delete API User with the ID: ${id}?`);
    setConfirmationDialogDescription(
      `Are you sure you want to delete the API User with the ID: ${id}?\nThis action cannot be undone.`
    );
    setConfirmationDialogId(id);
    setIsConfirmationDialogVisible(true);
  };

  // Close the confirmation dialog
  const handleCloseConfirmationDialog = (): void => {
    setIsConfirmationDialogVisible(false);
  };

  // Send IPC request to the main process to delete an API user from the database
  const handleConfirmationDialogConfirm = (id: number | undefined): void => {
    window.electron.ipcRenderer.send("deleteAPIUser", id);
  };

  // Receive the response from the main process and remove the deleted API user from state
  useEffect(() => {
    const handleDeleteAPIUserReply = (event: IpcRendererEvent, response): void => {
      if (response.success) {
        setAPIUsers((prevAPIUsers) =>
          prevAPIUsers.filter((apiUser) => apiUser.id !== response.results)
        );
        toast({
          title: "API User Deleted",
          description: `API User has been deleted`
        });
      } else {
        toast({
          title: "API User Deletion Failed",
          variant: "destructive",
          description: `${response.results}`
        });
      }

      setIsConfirmationDialogVisible(false);
    };

    // Add the listener on mount
    const deleteAPIUserReplyListener = window.electron.ipcRenderer.on(
      "deleteAPIUserReply",
      handleDeleteAPIUserReply
    );

    // Remove the listener on unmount
    return (): void => {
      deleteAPIUserReplyListener();
    };
  }, []);

  // Send IPC request to the main process to add an existing API user to the database
  const handleAddExistingAPIUser = (existingAPIUser: CreateAPIUserZodSchema): void => {
    window.electron.ipcRenderer.send("createExistingAPIUser", existingAPIUser);
  };

  // Receive the response from the main process and add the created API user to state
  useEffect(() => {
    const handleAddExistingAPIUser = (event: IpcRendererEvent, response): void => {
      if (response.success) {
        setAPIUsers((prevAPIUsers) => [...prevAPIUsers, response.results]);
        toast({
          title: "API User Added",
          description: `An API User for: ${response.results.apiUserCustomerName} has been added`
        });
      } else {
        toast({
          title: "API User Creation Failed",
          variant: "destructive",
          description: `${response.results}`
        });
      }
    };

    // Add the listener on mount
    const createExistingAPIUserReplyListener = window.electron.ipcRenderer.on(
      "createExistingAPIUserReply",
      handleAddExistingAPIUser
    );

    // Remove the listener on unmount
    return (): void => {
      createExistingAPIUserReplyListener();
    };
  }, []);

  /**
   *
   * TODO => We should instead be opening the confirmation dialogue
   * Need to refactor the confirmation dialog to handle this
   *
   */

  // Send IPC to main process to delete the reminder
  const handleDeleteReminder = (id: string): void => {
    window.electron.ipcRenderer.send("deleteReminder", id);
  };

  // Receive the response from the main process
  useEffect(() => {
    const handleDeleteReminderReply = (event: IpcRendererEvent, response): void => {
      setReminders((prevReminders) =>
        prevReminders.filter((reminder) => reminder.vehicle.id !== response.results)
      );

      if (response.success) {
        toast({
          title: "Reminder deleted",
          description: "You will no longer be reminded when this vehicle appears online"
        });
      } else {
        toast({
          title: "Error deleting reminder",
          variant: "destructive",
          description: response.results
        });
      }
    };

    // Add the listener on mount
    const handleDeleteReminderListener = window.electron.ipcRenderer.on(
      "deleteReminderReply",
      handleDeleteReminderReply
    );

    // Remove the listener on unmount
    return (): void => {
      handleDeleteReminderListener();
    };
  }, []);

  return (
    <>
      <div className="p-6">
        <Tabs defaultValue="apiUserList" className="grid">
          <TabsList className="bg-transparent ">
            <TabsTrigger
              className="bg-card text-white data-[state=active]:bg-primary data-[state=active]:text-white"
              value="apiUserList"
            >
              <FaUser />
              &nbsp;API Users
            </TabsTrigger>
            <TabsTrigger
              className="bg-card text-white data-[state=active]:bg-primary data-[state=active]:text-white"
              value="myReminders"
            >
              <FaTasks />
              &nbsp;My Reminders
            </TabsTrigger>
          </TabsList>
          <TabsContent value="apiUserList">
            <AddAPIUserDialog
              isOpen={isAddAPIUserDialogVisible}
              onClose={handleCloseDialog}
              onSaveExistingAPIUser={handleAddExistingAPIUser}
            />

            <ConfirmationDialog
              isOpen={isConfirmationDialogVisible}
              onClose={handleCloseConfirmationDialog}
              onConfirm={handleConfirmationDialogConfirm}
              title={confirmationDialogTitle}
              description={confirmationDialogDescription}
              confirmationDialogId={confirmationDialogId}
            />

            <APIUsersList
              apiUsers={apiUsers}
              onDeleteAPIUser={showConfirmationDialog}
              handleOpenExistingAPIUserDialog={handleOpenExistingAPIUserDialog}
            />
          </TabsContent>
          <TabsContent value="myReminders">
            <h1 className="text-2xl pt-6 text-center text-white">My Reminders</h1>
            <VehicleList vehicles={reminders} onDeleteReminder={handleDeleteReminder} />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </>
  );
}

export default Homepage;

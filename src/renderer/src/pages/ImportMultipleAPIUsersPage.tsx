import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Button } from "../components/ui/button";
import { IpcRendererEvent } from "electron";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../components/ui/toaster";

function ImportMultipleAPIUsersPage(): JSX.Element {
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Send IPC request to the main process to export API users
  const handleExport = async (): Promise<void> => {
    setIsExportLoading(true);
    window.electron.ipcRenderer.send("exportAPIUsers");
  };

  // Receive export status from the main process
  useEffect(() => {
    const exportAPIUsersReply = (event: IpcRendererEvent, response): void => {
      setIsExportLoading(false);
      if (response.success) {
        toast({
          title: "Export Successful",
          description: "API Users have been exported successfully.\nCheck your download folder"
        });
      } else {
        toast({
          title: "Export Failed",
          description: `Failed to export API Users: ${response.error}`,
          variant: "destructive"
        });
      }
    };

    // Add the listener on mount
    const exportAPIUsersReplylistener = window.electron.ipcRenderer.on(
      "exportAPIUsersReply",
      exportAPIUsersReply
    );

    // remove the listener on unmount
    return (): void => {
      exportAPIUsersReplylistener();
    };
  }, []);

  return (
    <>
      <div className="p-6">
        <Button onClick={() => navigate(-1)}>
          <MdArrowBackIos /> Back
        </Button>
        <div className="p-6 mt-3 max-w-xl mx-auto rounded-xl shadow-2xl flex flex-col gap-y-3 bg-card/50 backdrop-blur-xl">
          <h1 className="text-2xl font-medium text-white">Import / Export API Users</h1>
          <div className="flex flex-row ">
            <Button disabled={isExportLoading} onClick={handleExport}>
              {isExportLoading ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Exporting . . .
                </span>
              ) : (
                "Export API Users"
              )}
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default ImportMultipleAPIUsersPage;

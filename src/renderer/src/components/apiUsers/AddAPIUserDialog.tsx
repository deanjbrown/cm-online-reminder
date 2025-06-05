import { CreateAPIUserZodSchema } from "@/shared/schemas";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { Button } from "../ui/button";
import ExistingAPIUserForm from "./forms/ExistingAPIUserForm";

interface AddAPIUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExistingAPIUser: (existingAPIUser: CreateAPIUserZodSchema) => void;
}

const AddAPIUserDialog: React.FC<AddAPIUserDialogProps> = (props) => {
  const [apiUserCustomerName, setAPIUserCustomerName] = useState<string>("");
  const [apiUserUsername, setAPIUserUsername] = useState<string>("");
  const [apiUserPassword, setAPIUserPassword] = useState<string>("");
  const [orgId, setOrgId] = useState<string>("");
  const [apiKey, setAPIKey] = useState<string>("");

  const handleClose = (): void => {
    setAPIUserCustomerName("");
    setAPIUserUsername("");
    setAPIUserPassword("");
    setOrgId("");
    setAPIKey("");
    props.onClose();
  };

  // Create the relevant object and call the relevant function from props
  const onDialogSubmit = (): void => {
    const existingAPIUser: CreateAPIUserZodSchema = {
      apiUserCustomerName: apiUserCustomerName,
      apiUserUsername: apiUserUsername,
      apiUserPassword: apiUserPassword,
      orgId: orgId,
      apiKey: apiKey
    };
    handleClose();
    props.onSaveExistingAPIUser(existingAPIUser);
  };

  return (
    <>
      <Dialog open={props.isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-card/90 backdrop-blur-sm border border-card">
          <DialogHeader>
            <DialogTitle className="text-white">Add a New API User</DialogTitle>
            <DialogDescription className="text-slate-300">
              Enter the API User's Details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <ExistingAPIUserForm
              apiUserCustomerName={apiUserCustomerName}
              setAPIUserCustomerName={setAPIUserCustomerName}
              apiUserUsername={apiUserUsername}
              setAPIUserUsername={setAPIUserUsername}
              apiUserPassword={apiUserPassword}
              setAPIUserPassword={setAPIUserPassword}
              orgId={orgId}
              setOrgId={setOrgId}
              apiKey={apiKey}
              setAPIKey={setAPIKey}
            />

            <DialogFooter>
              <Button type="submit" onClick={onDialogSubmit}>
                Save API User
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddAPIUserDialog;

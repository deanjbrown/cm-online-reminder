import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number | undefined) => void;
  title: string;
  description: string;
  confirmationDialogId: number | undefined;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (props) => {
  return (
    <>
      <Dialog open={props.isOpen} onOpenChange={props.onClose}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogDescription>{props.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={props.onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => props.onConfirm(props.confirmationDialogId)}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConfirmationDialog;

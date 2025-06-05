import { CreateVehicleZodSchema, VehicleWithAPIUserZodSchema } from "@/shared/schemas/vehicle";
import { Button } from "../ui/button";

interface VehicleItemProps {
  vehicle: VehicleWithAPIUserZodSchema;
  onClickRemindMe?: (vehicle: CreateVehicleZodSchema) => void;
  onDeleteReminder?: (id: string) => void;
}

const presenceColorMap: Record<string, string> = {
  OFFLINE: "bg-gray-500",
  STATIONARY: "bg-red-500",
  MOVING: "bg-green-500",
  IDLING: "bg-yellow-500",
  UNKNOWN: "bg-gray-500"
};

const VehicleItem: React.FC<VehicleItemProps> = (props) => {
  return (
    <>
      <div className="p-6 max-w-xl mx-auto rounded-xl shadow-2xl flex flex-col gap-y-2 bg-card/50 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span
            className={`w-5 h-5 rounded-full ${presenceColorMap[props.vehicle.vehicle.presence ?? "OFFLINE"]}`}
          ></span>
          <span className="text-2xl font-medium text-white">{props.vehicle.vehicle.name}</span>
        </div>

        <p className="text-slate-300">
          <b className="text-white">Org Name: </b>
          {props.vehicle.apiUser?.apiUserCustomerName}
        </p>
        <p className="text-slate-300">
          <b className="text-white">Model: </b>
          {props.vehicle.vehicle.model}
        </p>

        <p className="text-slate-300">
          <b className="text-white">Current Status: </b>
          {props.vehicle.vehicle.presence}
        </p>

        <div className="flex flex-row gap-x-3 mt-4">
          {props.onClickRemindMe && (
            <Button onClick={() => props.onClickRemindMe?.(props.vehicle.vehicle)}>
              Remind Me When Online
            </Button>
          )}
          {props.onDeleteReminder && (
            <Button
              variant="destructive"
              onClick={() => props.onDeleteReminder?.(props.vehicle.vehicle.id)}
            >
              Cancel Reminder
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default VehicleItem;

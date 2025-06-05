import { CreateVehicleZodSchema, VehicleWithAPIUserZodSchema } from "@/shared/schemas/vehicle";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import VehicleItem from "./VehicleItem";

interface VehicleListProps {
  vehicles: VehicleWithAPIUserZodSchema[];
  onClickRemindMe?: (vehicle: CreateVehicleZodSchema) => void;
  onDeleteReminder?: (id: string) => void;
}

const VehicleList: React.FC<VehicleListProps> = (props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleWithAPIUserZodSchema[]>([]);

  useEffect(() => {
    setFilteredVehicles(() => {
      return props.vehicles.filter((vehicle: VehicleWithAPIUserZodSchema) => {
        return (
          vehicle.vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.vehicle.id.includes(searchTerm)
        );
      });
    });
  }, [props.vehicles, searchTerm]);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col gap-y-4 py-4 mx-16">
        <div className="flex flex-row gap-x-2">
          <Input
            className="bg-white"
            type="text"
            placeholder="Search Vehicles"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilter(e)}
          />
        </div>

        {filteredVehicles.map((vehicle: VehicleWithAPIUserZodSchema) => (
          <div className="py-4" key={vehicle.vehicle.id}>
            <VehicleItem
              vehicle={vehicle}
              onClickRemindMe={props.onClickRemindMe}
              onDeleteReminder={props.onDeleteReminder}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default VehicleList;

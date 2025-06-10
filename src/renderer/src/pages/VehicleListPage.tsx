import React, { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { IpcRendererEvent } from "electron";
import { APIUserZodSchema } from "@/shared/schemas";
import { CreateVehicleZodSchema, VehicleWithAPIUserZodSchema } from "@/shared/schemas/vehicle";
import VehicleList from "../components/vehicles/VehicleList";
import Loader from "../components/generic/Loader";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../components/ui/toaster";
import { getAPIUserId } from "../utils/queryParams";

const VehicleListPage: React.FC = () => {
  const [apiUserDetails, setAPIUserDetails] = useState<APIUserZodSchema>();
  const [vehicleList, setVehicleList] = useState<VehicleWithAPIUserZodSchema[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get the API user ID from the URL get params
  const apiUserId = getAPIUserId();

  const navigate = useNavigate();
  const { toast } = useToast();

  // Send IPC to main process to retrieve a list of vehicles related to the APIUser
  useEffect(() => {
    window.electron.ipcRenderer.send("fetchAPIUsersVehicles", apiUserId);
  }, []);

  // Handle the fetchApiUsersVehiclesReply from the main process
  useEffect(() => {
    const handleFetchAPIUsersVehiclesReply = (event: IpcRendererEvent, response): void => {
      setIsLoading(true);
      if (response.success) {
        setAPIUserDetails(response.results.apiUserDetails);
        setVehicleList(response.results.vehicleList);
      } else {
        toast({
          title: "Error retrieving vehicle data from API",
          variant: "destructive",
          description: response.error.toString()
        });
        // Redirect back to the previous page if the API user details are not found
        navigate(-1);
      }
      setIsLoading(false);
    };

    // Attach the listener when component mounts
    const handleFetchAPIUsersVehiclesReplyListener = window.electron.ipcRenderer.on(
      "fetchAPIUsersVehiclesReply",
      handleFetchAPIUsersVehiclesReply
    );

    // Remove the listener when component unmounts
    return (): void => {
      handleFetchAPIUsersVehiclesReplyListener();
    };
  }, [apiUserDetails]);

  /**
   *
   * onClickRemindMe
   * @param id
   * Called when the user clicks the remind me button.
   * Sends IPC to main process to add vehicle to the database for Reminder thread to check.
   */
  const onClickRemindMe = (vehicle: CreateVehicleZodSchema): void => {
    window.electron.ipcRenderer.send("createReminder", vehicle, apiUserDetails?.id);
  };

  // Receive the reply from the main process and update the UI
  useEffect(() => {
    const handlecreateReminder = (event: IpcRendererEvent, response): void => {
      if (response.success) {
        toast({
          title: "Reminder created",
          description: "You will be reminded the next time this vehicle is online"
        });
      } else {
        toast({
          title: "Error creating a reminder",
          variant: "destructive",
          description: String(response.results)
        });
      }
    };

    // Add the listener on mount
    const handlecreateReminderListener = window.electron.ipcRenderer.on(
      "createReminderReply",
      handlecreateReminder
    );

    // Remove the listener on unmount
    return (): void => {
      handlecreateReminderListener();
    };
  }, []);

  return (
    <>
      <div>
        {!isLoading ? (
          <div className="p-6">
            <Button onClick={() => navigate(-1)}>
              <MdArrowBackIos /> Back
            </Button>
            <h1 className="text-2xl pt-6 text-center text-white">
              {apiUserDetails?.apiUserCustomerName} Vehicles
            </h1>

            {vehicleList.length && (
              <VehicleList onClickRemindMe={onClickRemindMe} vehicles={vehicleList} />
            )}
          </div>
        ) : (
          <Loader />
        )}
      </div>
      <Toaster />
    </>
  );
};

export default VehicleListPage;

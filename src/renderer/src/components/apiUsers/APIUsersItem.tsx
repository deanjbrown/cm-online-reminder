import { APIUserZodSchema } from "@/shared/schemas";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

interface APIUserItemProps {
  apiUser: APIUserZodSchema;
  onDeleteAPIUser: (id: number) => void;
}

const APIUsersItem: React.FC<APIUserItemProps> = (props) => {
  const date = new Date(props.apiUser.createdAt);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const navigate = useNavigate();

  return (
    <>
      <div className="p-6 max-w-xl mx-auto rounded-xl shadow-2xl flex flex-col gap-y-2 bg-card/50 backdrop-blur-xl">
        <div className="text-2xl font-medium text-white">{props.apiUser.apiUserCustomerName}</div>
        <p className="text-slate-300">
          <b className="text-white">Username: </b>
          {props.apiUser.apiUserUsername}
        </p>
        <p className="text-slate-300">
          <b className="text-white">Added: </b>
          {day}/{month}/{year}
        </p>
        <p className="text-slate-300">
          <b className="text-white">Org ID: </b>
          {props.apiUser.orgId}
        </p>
        <p className="text-slate-300">
          <b className="text-white">API Key: </b>
          {props.apiUser.apiKey}
        </p>
        
        <div className="flex flex-row gap-x-3 mt-4">
          <Button onClick={() => navigate(`/vehicles?id=${props.apiUser.id}`)}>
            View Vehicles
          </Button>
          <Button variant="destructive" onClick={() => props.onDeleteAPIUser(props.apiUser.id)}>
            Delete API User
          </Button>
        </div>
      </div>
    </>
  );
};

export default APIUsersItem;

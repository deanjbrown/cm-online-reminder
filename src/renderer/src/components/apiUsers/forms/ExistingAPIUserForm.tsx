import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

interface ExistingAPIUserFormProps {
  apiUserCustomerName: string;
  setAPIUserCustomerName: (value: string) => void;
  apiUserUsername: string;
  setAPIUserUsername: (value: string) => void;
  apiUserPassword: string;
  setAPIUserPassword: (value: string) => void;
  orgId: string;
  setOrgId: (value: string) => void;
  apiKey: string;
  setAPIKey: (value: string) => void;
}

const ExistingAPIUserForm: React.FC<ExistingAPIUserFormProps> = (props) => {
  return (
    <>
      {/* Org Name */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="api-user-customer-name" className="text-right text-slate-300">
          Org Name
        </Label>
        <Input
          type="text"
          id="api-user-customer-name"
          name="api-user-customer-name"
          value={props.apiUserCustomerName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            props.setAPIUserCustomerName(e.target.value)
          }
          className="col-span-3 bg-white"
          placeholder="Org Name"
          required
        />
      </div>

      {/* API Username */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="api-user-username" className="text-right text-slate-300">
          Username
        </Label>
        <Input
          type="email"
          id="api-user-username"
          name="api-user-username"
          value={props.apiUserUsername}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            props.setAPIUserUsername(e.target.value)
          }
          className="col-span-3 bg-white"
          placeholder="API User Username"
          required
        />
      </div>

      {/* API Password */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="api-user-password" className="text-right text-slate-300">
          Password
        </Label>
        <Input
          type="password"
          id="api-user-password"
          name="api-user-password"
          value={props.apiUserPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            props.setAPIUserPassword(e.target.value)
          }
          className="col-span-3 bg-white"
          placeholder="API User Password"
          required
        />
      </div>

      {/* Org Id */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="org-id" className="text-right text-slate-300">
          Org ID
        </Label>
        <Input
          type="text"
          id="org-id"
          name="org-id"
          value={props.orgId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setOrgId(e.target.value)}
          className="col-span-3 bg-white"
          placeholder="Org ID"
          required
        />
      </div>

      {/* API Key */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="api-key" className="text-right text-slate-300">
          API Key
        </Label>
        <Input
          type="text"
          id="api-key"
          name="api-key"
          value={props.apiKey}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setAPIKey(e.target.value)}
          className="col-span-3 bg-white"
          placeholder="API Key"
          required
        />
      </div>
    </>
  );
};

export default ExistingAPIUserForm;

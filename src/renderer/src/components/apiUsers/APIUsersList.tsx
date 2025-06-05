import { IoMdArrowDropdown } from "react-icons/io";
import { APIUserZodSchema } from "@/shared/schemas";
import APIUsersItem from "./APIUsersItem";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router";

interface APIUsersListProps {
  apiUsers: APIUserZodSchema[];
  onDeleteAPIUser: (id: number) => void;
  handleOpenExistingAPIUserDialog: () => void;
}

const APIUsersList: React.FC<APIUsersListProps> = (props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredAPIUsers, setFilteredAPIUsers] = useState<APIUserZodSchema[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    setFilteredAPIUsers(() => {
      return props.apiUsers.filter((apiUser: APIUserZodSchema) => {
        return (
          apiUser.apiUserCustomerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apiUser.apiUserUsername.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    });
  }, [props.apiUsers, searchTerm]);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <h1 className="text-2xl pt-6 text-center text-white">API Users</h1>
      <div className="flex flex-col gap-y-4 py-4 mx-16">
        <div className="flex flex-row gap-x-2">
          <Input
            className="bg-white"
            type="text"
            placeholder="Search API Users"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilter(e)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                Add API User <IoMdArrowDropdown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={() => {
                    setTimeout(() => {
                      props.handleOpenExistingAPIUserDialog();
                    }, 0); // Delay opening the dialog so the dropdown has time to close
                  }}
                >
                  Add API User
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    navigate("/import_multiple_api_users");
                  }}
                >
                  Import Multiple API Users
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {filteredAPIUsers.map((apiUser: APIUserZodSchema) => (
          <div className="py-4" key={apiUser.id}>
            <APIUsersItem onDeleteAPIUser={props.onDeleteAPIUser} apiUser={apiUser} />
          </div>
        ))}
      </div>
    </>
  );
};

export default APIUsersList;

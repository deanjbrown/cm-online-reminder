import { MdArrowBackIos } from "react-icons/md";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";

function ImportMultipleAPIUsersPage(): JSX.Element {
  const navigate = useNavigate();
  return (
    <>
      <div className="p-6">
        <Button onClick={() => navigate(-1)}>
          <MdArrowBackIos /> Back
        </Button>
        <div className="p-6 mt-3 max-w-xl mx-auto rounded-xl shadow-2xl flex flex-col gap-y-2 bg-card/50 backdrop-blur-xl">
          <h1 className="text-2xl font-medium text-white">Import Multiple API Users</h1>
          <p className="text-slate-300">This feature is in development. An update will be available soon.</p>
        </div>
      </div>
    </>
  );
}

export default ImportMultipleAPIUsersPage;

import { Route, Routes } from "react-router";
import Homepage from "./pages/Homepage";
import VehicleListPage from "./pages/VehicleListPage";
import ImportMultipleAPIUsersPage from "./pages/ImportMultipleAPIUsersPage";

function App(): JSX.Element {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/vehicles" element={<VehicleListPage />} />
        <Route path="/import_multiple_api_users" element={<ImportMultipleAPIUsersPage />} />
      </Routes>
    </>
  );
}

export default App;

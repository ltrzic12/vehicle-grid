import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import MakesPage from "./pages/MakesPage/MakesPage";
import ModelsPage from "./pages/ModelsPage/ModelsPage";
import "./app.css";
import FormPage from "./pages/Form/FormPage";
import Loader from "./components/Loader/Loader";
import form from "./stores/FormStore";
import vehicleMakeStore from "./stores/VehicleMakeStore";
import vehicleModelStore from "./stores/VehicleModelStore";
import NewMakePage from "./pages/Form/NewMakePage";

function App() {
  return (
    <div className='app'>
      <div className='vehicle-app'>
        <NavBar></NavBar>
        {vehicleMakeStore.isLoading ||
        vehicleModelStore.isLoading ||
        form.isLoading ? (
          <Loader></Loader>
        ) : (
          <Routes>
            <Route path='/' element={<MakesPage />}></Route>
            <Route path='/models' element={<ModelsPage />}></Route>
            <Route path='/form' element={<FormPage />}></Route>
            <Route path='/form/edit-model' element={<FormPage />}></Route>
            <Route path='/form/new-make' element={<NewMakePage />}></Route>
            <Route path='/form/edit-make' element={<FormPage />}></Route>
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;

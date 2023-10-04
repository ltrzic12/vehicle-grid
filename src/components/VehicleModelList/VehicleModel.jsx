import { useEffect } from "react";
import { observer } from "mobx-react";
import "./vehicleModel.css";
import vehicleStore from "../../stores/VehicleStore";
import VehicleModelModal from "./VehicleModelModal";
import PaginationButton from "../PaginationButton/PaginationButton";

const VehicleModelList = () => {
  useEffect(() => {
    const fetchData = async () => {
      await vehicleStore.changePage("models");
      vehicleStore.resetAllFilters();
      await vehicleStore.fetchVehicleMakes();
      await vehicleStore.fetchVehicleModels();
      console.log("Models: ", vehicleStore.vehicleModels);
    };
    fetchData();
  }, []);

  const handleChangeDirection = async (e) => {
    const sort = e.target.value === "true";

    vehicleStore.changeSelectedDirection(sort);
    await vehicleStore.fetchVehicleModels();
  };

  const handleChangeFilter = async (e) => {
    const filter = e.target.value;
    console.log(filter);
    vehicleStore.changeSelectedSort(filter);
    await vehicleStore.fetchVehicleModels();
  };

  const handleFilterByMakeId = async (e) => {
    const makeID = e.target.value;
    await vehicleStore.changeSelectedMakeID(makeID);
  };

  const style = {
    color: "rgb(101 103 107)",
  };

  return (
    <div className='vehicle-model-list'>
      <div className='toolbar'>
        <div>
          <label htmlFor='filter'>
            <i className='fa-solid fa-filter' style={style}></i>
          </label>
          <select name='filter' onChange={handleChangeFilter}>
            <option value='name'>Name</option>
            <option value='created_at'>Time</option>
          </select>
        </div>
        <div>
          <label htmlFor='filterByMakeId'>MakeID</label>
          <select name='filterByMakeId' id='' onChange={handleFilterByMakeId}>
            <option value=''>All</option>
            {vehicleStore.vehicleMakes.map((make) => {
              return (
                <option value={make.id} key={make.id}>
                  {make.name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label htmlFor='orderBy'>
            {vehicleStore.ascending === true ? (
              <i className='fa-solid fa-arrow-down-a-z' style={style}></i>
            ) : (
              <i className='fa-solid fa-arrow-down-z-a' style={style}></i>
            )}
          </label>
          <select name='orderBy' onChange={handleChangeDirection}>
            <option value='true'>Ascending</option>
            <option value='false'>Descending</option>
          </select>
        </div>
      </div>
      {vehicleStore.vehicleModels && (
        <ul className='model-list'>
          {vehicleStore.vehicleModels.map((vehicle) => (
            <li key={vehicle.id}>
              <VehicleModelModal vehicle={vehicle}></VehicleModelModal>
            </li>
          ))}
        </ul>
      )}

      <PaginationButton></PaginationButton>
    </div>
  );
};

export default observer(VehicleModelList);

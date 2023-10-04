import vehicleModelService from "./VehicleModelService";
import supabase from "../config/supabaseClient";
import vehicleMakeStore from "../stores/VehicleMakeStore";

class VehicleMakeService {
  fetchVehicleMakes = async () => {
    vehicleMakeStore.setLoading(true);
    let query = supabase
      .from("VehicleMake")
      .select()
      .order(vehicleMakeStore.selectedSort, {
        ascending: vehicleMakeStore.ascending,
      });

    if (vehicleMakeStore.page === "makes") {
      query = query.range(vehicleMakeStore.startAt, vehicleMakeStore.endAt);
    }

    const { data, error } = await query;

    if (error) {
      vehicleMakeStore.setFetchError("Error");
      vehicleMakeStore.replaceMakes(null);
      console.log(error);
      vehicleMakeStore.setLoading(false);
    }

    if (data) {
      vehicleMakeStore.replaceMakes(data);
      await this.calculateNumberOfData("VehicleMake");
      vehicleMakeStore.setFetchError(null);
      vehicleMakeStore.setLoading(false);
      console.log(
        "Ukupno modela u bazi: ",
        vehicleMakeStore.totalNumberOfData,
        "Ukupno stranica: ",
        vehicleMakeStore.numberOfPages,
        "Povučeni modeli: ",
        vehicleMakeStore.vehicleMakes,
      );
    }
  };

  async calculateNumberOfData() {
    try {
      const { data, error } = await supabase.from("VehicleMake").select("id");

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        vehicleMakeStore.setTotalNumberOfData(data.length);
        vehicleMakeStore.numberOfPages = Math.ceil(
          data.length / vehicleMakeStore.pageSize,
        );
      }
    } catch (error) {
      console.error("Error calculating total number of items:", error);
    }
  }

  deleteVehicleMake = async (id) => {
    const { data, error } = await supabase
      .from("VehicleMake")
      .delete()
      .eq("id", id)
      .select();
    if (error) {
      console.error("Error: ", error);
    }

    if (data) {
      console.log(data, "ID:", id);
      await vehicleModelService.deleteVehicleModelsByMakeId(id);
      this.fetchVehicleMakes();
    }
  };

  async createMake(name, abrv) {
    if (!name || !abrv) {
      console.error("Please fill in all the fields!");
      return;
    }
    const { data, error } = await supabase
      .from("VehicleMake")
      .insert([{ name, abrv }])
      .select();

    if (error) {
      console.error("Error: ", error);
    }

    if (data) {
      console.log(data);
    }
  }

  async editVehicleMake(name, abrv, id) {
    const { data, error } = await supabase
      .from("VehicleMake")
      .update({ name, abrv })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error: ", error);
    }

    if (data) {
      console.log(data);
    }
  }

  fetchNextPage = async () => {
    vehicleMakeStore.incrementPageIndex();
    await this.fetchVehicleMakes();
  };

  fetchPreviousPage = async () => {
    vehicleMakeStore.decrementPageIndex();
    await this.fetchVehicleMakes();
  };
}

const vehicleMakeService = new VehicleMakeService();
export default vehicleMakeService;

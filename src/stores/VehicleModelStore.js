import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { action, makeObservable, observable } from "mobx";
import db from "../config/firebaseConfig";

class VehicleModelStore {
  vehicleModels = [];
  isLoading = false;

  constructor() {
    makeObservable(this, {
      vehicleModels: observable,
      isLoading: observable,
      fetchVehicleModels: action,
    });
  }

  fetchVehicleModels = async (makeId, sort) => {
    try {
      this.isLoading = true;
      const collectionRef = collection(db, "VehicleModel");
      let queryConstraint = collectionRef;

      if (makeId) {
        queryConstraint = query(queryConstraint, where("makeId", "==", makeId));
      }

      if (sort) {
        queryConstraint = query(queryConstraint, orderBy("name", sort));
      }

      const unsubscribe = onSnapshot(queryConstraint, (snapshot) => {
        const models = [];
        snapshot.forEach((doc) => {
          models.push({ id: doc.id, ...doc.data() });
        });

        action(() => {
          this.vehicleModels.replace(models);
        })();
      });

      this.unsubscribe = unsubscribe;
    } catch (error) {
      console.error("Error fetching VehicleMakes:", error);
    } finally {
      this.isLoading = false;
    }
  };

  stopListeningToChanges() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

const vehicleModelStore = new VehicleModelStore();
export default vehicleModelStore;

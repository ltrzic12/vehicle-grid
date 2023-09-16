import { observer } from "mobx-react";
import form from "../../stores/FormStore";
import "./form.css";
import vehicleMakeStore from "../../stores/VehicleMakeStore";
import formService from "../../services/FormService";
import { useParams } from "react-router-dom";

const Form = () => {
  const { mode } = useParams();

  console.log(mode);
  let type;

  if (mode === "edit") {
    type = "edit model";
  } else {
    type = form.formType;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form.name);
    formService.submitForm();
    form.resetForm();
  };

  return (
    <div>
      {form.formType === "new make" && <h2>Add new maker</h2>}
      {form.formType === "new model" && <h2>Add new model</h2>}
      {type === "edit model" && <h2>Edit vehicle info</h2>}
      <form onSubmit={handleSubmit}>
        <label htmlFor='name'>{`Enter new ${form.formType} name`}</label>
        <input
          type='text'
          value={form.name}
          onChange={(e) => form.setName(e.target.value)}
        />
        <label htmlFor='abrv'>{`Enter new ${form.formType} abrivation`}</label>
        <input
          type='text'
          name='abrv'
          value={form.abrv}
          onChange={(e) => form.setAbrv(e.target.value)}
        />
        {form.formType === "new model" && (
          <div>
            <label htmlFor='maker'>Pick car maker</label>
            <select
              name='maker'
              id=''
              value={form.makeId}
              onChange={(e) => form.setMakeId(e.target.value)}>
              <option value='none'>Choose a maker</option>
              {vehicleMakeStore.vehicleMakes.map((vehicle) => (
                <option value={vehicle.id}>{vehicle.name}</option>
              ))}
            </select>
          </div>
        )}
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default observer(Form);

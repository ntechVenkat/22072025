import { useEffect, useState } from "react";
import axios from "axios";

function RegisterUsers() {
  const initialFormData = { name: "", password: "", confirmPassword: "" };
  const [inputFormData, setInputFormData] = useState(initialFormData);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");
  const changeHandler = (event) => {
    const { name, value } = event.target;
    setInputFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    //Calling fetchUsers when the component mounts
    fetchUsers();
  }, []);

  // Defining Fetch users when the component mounts
  const fetchUsers = async () => {
    //Get request to /users endpoint
    const userResponse = await axios.get(`http://localhost:3500/users`);
    console.log("Get Response:", userResponse.data);
    // Update users state with fetched data
    setUsers(userResponse.data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(inputFormData);
    try {
      const response = await axios.post(
        "http://localhost:3500/register",
        inputFormData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Post Response:", response.data, response.message);
    } catch (error) {
      console.error("Error:", error, error.response.data.message);
      setErr(error.response.data.message);
    }
    setInputFormData(initialFormData); // Reset form after submission
    fetchUsers();
  };
  return (
    <div>
      <center>
        <form className="m-2 form-control w-50">
          <h4>SignUp Form</h4>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={inputFormData.name}
            onChange={changeHandler}
            className="m-2"
          />
          <br />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={inputFormData.password}
            onChange={changeHandler}
            className="m-2"
          />
          <br />
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={inputFormData.confirmPassword}
            onChange={changeHandler}
            className="m-2"
          />
          <br />
          <button onClick={handleSubmit} className="btn btn-primary m-2">
            SignUp
          </button>
          <p className="text-danger">{err}</p>
        </form>
        <h3>Registered Users Data Table</h3>
        <table className="table table-bordered w-50">
          <thead>
            <tr>
              <th>Name</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </center>
    </div>
  );
}
export default RegisterUsers;

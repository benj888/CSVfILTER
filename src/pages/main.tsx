import { data } from "../../data/mock_data";
import { useState } from "react";
import Dropdown from "@/components/dropdown";

const Data = () => {
  const [searchText, setSearchText] = useState("");
  const [searchGender, setSearchGender] = useState("");
  const filterSerach = data.filter((item) => {
    const firstName = item.first_name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const gender = searchGender === item.gender;
    const MaleOrFemale = item.gender !== "Female" && item.gender !== "Male";

    if (searchGender === "") {
      return firstName;
    } else if (searchGender === "Other") {
      return firstName && MaleOrFemale;
    } else {
      return firstName && gender;
    }
  });

  const exportCSV = () => {
    const csvHeader = [
      "id",
      "first_name",
      "last_name",
      "email",
      "gender",
      "ip_address",
    ];
    const exportData = filterSerach.map((item, index) => [
      item.id,
      item.first_name,
      item.last_name,
      item.email,
      item.gender,
      item.ip_address,
    ]);
    const csvContent = [
      csvHeader.join(","),
      ...exportData.map((item) => item.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "data.csv");
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
    }
  };

  return (
    <>
      <div className="p-10 h-full bg-[rgb(245,245,253)] pt-20 ">
        <div className="grid grid-cols-6 pb-2 gap-10">
          <div className="text-lg ">
            <p>First name</p>
            <input
              type="text"
              placeholder="First name"
              className="shadow-lg border rounded px-4 py-1"
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
          </div>

          <div className="text-lg">
            <p>Gender</p>

            {/* <select
              id="dropdown"
              onChange={(e) => {
                setSearchGender(e.target.value);
              }}
              className="shadow-lg p-2"
            >
              <option value="" disabled selected>
                ---
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select> */}

            <Dropdown
              options={["Male", "Female", "Other"]}
              onSelect={setSearchGender}
            />
          </div>

          <div className="pt-6">
            <button
              onClick={exportCSV}
              className="p-2 text-white rounded  bg-blue-400 shadow-lg"
            >
              Export to CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-6 font-bold border bg-[#eaf3fc] text-lg p-2 ">
          <p className="px-2">id</p>
          <p>first_name</p>
          <p>last_name</p>
          <p>email</p>
          <p className="px-6">gender</p>
          <p>ip_address</p>
        </div>

        <div className="h-2/3 overflow-auto bg-white ">
          {filterSerach.map((item, index) => (
            <div key={index} className="grid grid-cols-6 border p-2 text-lg">
              <p className="px-2">{item.id}</p>
              <p>{item.first_name}</p>
              <p>{item.last_name}</p>
              <p>{item.email}</p>
              <p className="px-10">{item.gender}</p>
              <p className="px-4">{item.ip_address}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Data;

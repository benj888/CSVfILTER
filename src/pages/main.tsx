import { data } from "../../data/mock_data";
import { useState } from "react";
import Dropdown from "@/components/dropdown";

const Data = () => {
  const [searchText, setSearchText] = useState("");
  const [searchGender, setSearchGender] = useState("Male");
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
      <div className="p-4 lg:p-10 h-full bg-[rgb(245,245,253)]  flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-6 pb-2 gap-x-10">
          <div className="text-lg ">
            <p>First name</p>
            <input
              type="text"
              placeholder="First name"
              className="shadow-lg border rounded px-4 py-1 w-full"
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
          </div>

          <div className="text-lg relative z-20">
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
              defaultLabel={"Male"}
            />
          </div>

          <div className="pt-7">
            <button
              onClick={exportCSV}
              className="p-2 text-white rounded  bg-blue-400 shadow-lg w-full"
            >
              Export to CSV
            </button>
          </div>
        </div>


        <div className="flex-1 bg-white overflow-auto">

        <table className="table-auto w-full border-collapse border border-gray-300 text-lg ">
          <thead className=" font-bold border bg-[#eaf3fc]  p-2 sticky top-0">

            <th className="text-left p-2">id</th>
            <th className="text-left p-2">first_name</th>
            <th className="text-left p-2">last_name</th>
            <th className="text-left p-2">email</th>
            <th className="text-left p-2">gender</th>
            <th className="text-left p-2">ip_address</th>
          </thead>

          <tbody className="h-full bg-white">
            {filterSerach.map((item, index) => (
              <tr
                key={index}
                className={` border p-2  ${
                  index % 2 === 0 ? "bg-white" : "bg-[rgb(247,248,253,1)]"
                }`}
              >
                <td className="p-2">{item.id}</td>
                <td className="p-2">{item.first_name}</td>
                <td className="p-2">{item.last_name}</td>
                <td className="p-2">{item.email}</td>
                <td className="p-2">{item.gender}</td>
                <td className="p-2">{item.ip_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  );
};

export default Data;

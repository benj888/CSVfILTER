import { data } from "../../data/mock_data";
import { useEffect, useState } from "react";
import Dropdown from "@/components/dropdown";
import { useRouter } from "next/router";
import { PortalDraw } from "@/components/portalDrawer";
const Data = () => {
  const [searchText, setSearchText] = useState("");
  const [searchGender, setSearchGender] = useState<string[]>([]);
  const [clicklist, setClicklist] = useState(data);

  const [newdata, setNewdata] = useState({
    id: Math.max(...clicklist.map((item) => item.id))+ 1 ,
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    ip_address: "",
  });

  const handleAddData = () => {
    if (
      newdata.id &&
      newdata.first_name &&
      newdata.gender &&
      newdata.last_name &&
      newdata.ip_address &&
      newdata.email
    ) {
      setClicklist([...clicklist, newdata]);
      // clicklist.push(newdata);
      setNewdata({
        id: Math.max(...clicklist.map((item) => item.id))+ 1 ,
        first_name: "",
        last_name: "",
        email: "",
        gender: "",
        ip_address: "",
      });
      setnewDataWindow(false);
    } else {
      alert("還有資料未填寫");
    }
  };

  const [newDataWindow, setnewDataWindow] = useState(false);

  useEffect(() => {
    const filterSerach = data.filter((item) => {
      const firstName = item.first_name
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const other =
        searchGender.includes("Other") &&
        item.gender !== "Male" &&
        item.gender !== "Female";

      const gender = searchGender.includes(item.gender) || other;

      if (searchGender.length === 0) {
        return firstName;
      } else return firstName && gender;
    });
    setClicklist(filterSerach);
  }, [searchText, searchGender]);

  const exportCSV = () => {
    const csvHeader = [
      "id",
      "first_name",
      "last_name",
      "email",
      "gender",
      "ip_address",
    ];
    const exportData = clicklist.map((item, index) => [
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

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handledragging = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggingIndex === null || draggingIndex === index) return;
    const editList = [...clicklist];
    const [draggedItem] = editList.splice(draggingIndex, 1);
    editList.splice(index, 0, draggedItem);
    setClicklist(editList);
    setDraggingIndex(null);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };
  const router = useRouter();

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

          <div className="pt-7">
            <button
              className="text-white w-full p-2 bg-blue-400 rounded shadow-lg"
              onClick={() => setnewDataWindow(true)}
            >
              ADD
            </button>

            <PortalDraw
              visible={newDataWindow}
              handleSetVisible={setnewDataWindow}
            >
              <div className="p-6 ">
                <div className="flex items-center pb-4">
                  <label className="w-24 font-semibold">First Name:</label>
                  <input
                    type="text"
                    className="border p-2"
                    placeholder="First Name"
                    value={newdata.first_name}
                    onChange={(e) =>
                      setNewdata({ ...newdata, first_name: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center pb-4">
                  <label className="w-24 font-semibold">Last Name:</label>
                  <input
                    type="text"
                    className="border p-2"
                    placeholder="Last Name"
                    value={newdata.last_name}
                    onChange={(e) =>
                      setNewdata({ ...newdata, last_name: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center pb-4">
                  <label className="w-24 font-semibold">Email:</label>
                  <input
                    type="text"
                    className="border p-2"
                    placeholder="Email"
                    value={newdata.email}
                    onChange={(e) =>
                      setNewdata({ ...newdata, email: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center pb-4">
                  <label className="w-24 font-semibold">Gender:</label>
                  <input
                    type="text"
                    className="border p-2"
                    placeholder="Gender"
                    value={newdata.gender}
                    onChange={(e) =>
                      setNewdata({ ...newdata, gender: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center pb-4">
                  <label className="w-24 font-semibold">IP Address:</label>
                  <input
                    type="text"
                    className="border p-2"
                    placeholder="IP Address"
                    value={newdata.ip_address}
                    onChange={(e) =>
                      setNewdata({ ...newdata, ip_address: e.target.value })
                    }
                  />
                </div>

                <div
                  className="mt-20 ml-32 text-xl text-center shadow-lg border w-20 bg-blue-300 cursor-pointer"
                  onClick={() => {
                    handleAddData();
                    setnewDataWindow(false);
                  }}
                >
                  <button>送出</button>
                </div>
              </div>
            </PortalDraw>
          </div>

          <div className="pt-7">
            <button
              className="text-white w-full p-2 bg-red-400 rounded shadow-lg"
              onClick={() => router.push("/")}
            >
              To Github Search
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white overflow-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 text-lg ">
            <thead className=" font-bold border bg-[#eaf3fc]  p-2 sticky top-0">
              <tr>
                <th className="text-left p-2">id</th>
                <th className="text-left p-2">first_name</th>
                <th className="text-left p-2">last_name</th>
                <th className="text-left p-2">email</th>
                <th className="text-left p-2">gender</th>
                <th className="text-left p-2">ip_address</th>
              </tr>
            </thead>

            <tbody className="h-full bg-white">
              {clicklist.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border p-2 cursor-pointer hover:bg-gray-300  duration-200
                    ${index % 2 === 0 ? "bg-white" : "bg-[rgb(247,248,253,1)]"}
                 ${draggingIndex === index ? "bg-gray-300 shadow-lg" : ""}
                    `}
                  draggable
                  onDragStart={() => handledragging(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
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

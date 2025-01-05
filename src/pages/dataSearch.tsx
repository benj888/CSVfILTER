import { data } from "../../data/mock_data";
import { ReactNode, useEffect, useState } from "react";
import Dropdown from "@/components/dropdown";
import { useRouter } from "next/router";
import { PortalDraw } from "@/components/portalDrawer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
const Data = () => {
  const [searchText, setSearchText] = useState("");

  const [searchGender, setSearchGender] = useState<string[]>([]);

  const [clicklist, setClicklist] = useState(data);

  const [newList, setNewList] = useState(data);

  // const [editDataTri, setEditDataTri] = useState(true);

  const [editData, setEditData] = useState(false);

  const router = useRouter();

  const [newDataWindow, setnewDataWindow] = useState(false);

  const [newdata, setNewdata] = useState({
    id: Math.max(...newList.map((item) => item.id)) + 1,
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
      setNewList([...newList, newdata]);

      setNewdata((prev) => ({
        ...prev,
        first_name: "",
        last_name: "",
        email: "",
        gender: "",
        ip_address: "",
      }));
      setnewDataWindow(false);
    } else {
      alert("還有資料未填寫");
    }
  };

  useEffect(() => {
    if (newList.length > 0) {
      setNewdata((prev) => ({
        ...prev,
        id: Math.max(...newList.map((item) => item.id)) + 1,
      }));
    } else {
      setNewdata((prev) => ({ ...prev, id: 1 }));
    }
    if (newDataWindow === false) {
      setNewdata((prev) => ({
        ...prev,
        first_name: "",
        last_name: "",
        email: "",
        gender: "",
        ip_address: "",
      }));
    }
  }, [newList, newDataWindow]);

  useEffect(() => {
    const filterSerach = newList.filter((item) => {
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
  }, [searchText, searchGender, newList]);

  // csv
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

  // drag

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

  //multiple delete
  // const [isCheckboxVisible, setIsCheckboxVisible] = useState(false);
  // const [deleteVisible, setDeleteVisible] =  useState(false);
  const [deleteId, setDeleteId] = useState<number[]>([]);

  const handleCheckDelete = (id: number) => {
    if (deleteId.includes(id)) {
      setDeleteId(deleteId.filter((checkId) => checkId !== id));
    } else {
      setDeleteId((prevId) => [...prevId, id]);
    }
  };
  const handleDeleteSelected = () => {
    setNewList((prev) => prev.filter((item) => !deleteId.includes(item.id)));
    setDeleteId([]);
    // setIsCheckboxVisible(false);
  };

  //single delete

  // const [singledeleteId, setSingleDeleteId] = useState<number | null>(null);
  const handleSingleDelete = (id: number) => {
    setNewList(newList.filter((item) => item.id !== id));
  };

  // edit

  type NewData = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
    ip_address: string;
  };
  const [editItem, setEditItem] = useState<any>(null);

  const handleSaveEdit = () => {
    setNewList((prevList) =>
      prevList.map((item) =>
        item.id === editItem.id ? { ...item, ...editItem } : item
      )
    );
    setEditItem(null);
  };

  return (
    <>
      <div className="p-4 lg:p-10 h-full bg-[rgb(245,245,253)]  flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-7 pb-2 gap-x-10">
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
              className="flex items-center justify-center p-2 text-white rounded  bg-yellow-500 shadow-lg w-full"
            >
              Export to CSV <FileDownloadIcon />
            </button>
          </div>

          <div className="pt-7 ">
            <button
              className="flex items-center justify-center text-white w-full p-2 bg-blue-600 rounded shadow-lg"
              onClick={() => setnewDataWindow(true)}
            >
              <AddIcon className="pb-1 " /> ADD
            </button>

            <PortalDraw
              visible={newDataWindow}
              handleSetVisible={setnewDataWindow}
            >
              <div className="p-6 ">
                <div className="flex items-center pb-4 ">
                  <label className="w-24 font-semibold">First Name:</label>
                  <input
                    type="text"
                    className="border p-2 shadow-md rounded"
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
                    className="border p-2 shadow-md rounded"
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
                    className="border p-2 shadow-md rounded"
                    placeholder="Email"
                    value={newdata.email}
                    onChange={(e) =>
                      setNewdata({ ...newdata, email: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center pb-4">
                  <label className="w-24 font-semibold">Gender:</label>
                  {/* <input
                    type="text"
                    className="border p-2"
                    placeholder="Gender"
                    value={newdata.gender}
                    onChange={(e) =>
                      setNewdata({ ...newdata, gender: e.target.value })
                    }
                  /> */}
                  <select
                    id="dropdown"
                    value={newdata.gender}
                    onChange={(e) => {
                      setNewdata({ ...newdata, gender: e.target.value });
                    }}
                    className="border shadow-lg p-2 rounded"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex items-center pb-4">
                  <label className="w-24 font-semibold">IP Address:</label>
                  <input
                    type="text"
                    className="border p-2 shadow-md rounded"
                    placeholder="IP Address"
                    value={newdata.ip_address}
                    onChange={(e) =>
                      setNewdata({ ...newdata, ip_address: e.target.value })
                    }
                  />
                </div>

                <div
                  className="text-xl text-center shadow-lg border cursor-pointer "
                  onClick={() => {
                    handleAddData();
                  }}
                >
                  <button className="text-white w-full p-2 bg-blue-600 rounded">
                    送出
                  </button>
                </div>
              </div>
            </PortalDraw>
          </div>

          <div
            className="pt-7"
            onClick={() => {
              // setIsCheckboxVisible(!isCheckboxVisible);
              // setEditDataTri(false);
            }}
          >
            <div className="">
              <button
                className={`flex items-center justify-center p-2 text-white rounded shadow-lg w-full ${
                  deleteId.length > 0 ? "bg-red-600" : "bg-red-600/50"
                }`}
                onClick={handleDeleteSelected}
                disabled={!deleteId}
              >
                Delete <DeleteForeverIcon />
              </button>
            </div>

            {/* <button className="p-2 text-white rounded  bg-red-500 shadow-lg w-full">
                Delete
              </button> */}
          </div>

          <div className="pt-7">
            <button
              className="flex items-center justify-center text-white w-full p-2 bg-green-500 rounded shadow-lg"
              onClick={() => router.push("/")}
            >
              To Github Search <ArrowForwardIcon />
            </button>
          </div>

          <div className="pt-7">
            {/* <button
              className="p-2 text-white rounded  bg-green-500 shadow-lg w-full"
              onClick={(e) => {
                // setEditDataTri(!editDataTri);
                setIsCheckboxVisible(false);
                e.stopPropagation();
              }}
            >
              Edit
            </button> */}

            {editData && (
              <PortalDraw visible={editData} handleSetVisible={setEditData}>
                <div className="p-6 ">
                  <div className="flex items-center pb-4">
                    <label className="w-24 font-semibold">First Name:</label>
                    <input
                      type="text"
                      className="border p-2"
                      placeholder="First Name"
                      value={editItem?.first_name}
                      onChange={(e) =>
                        setEditItem((prev: NewData) => ({
                          ...prev,
                          first_name: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center pb-4">
                    <label className="w-24 font-semibold">Last Name:</label>
                    <input
                      type="text"
                      className="border p-2"
                      placeholder="Last Name"
                      value={editItem?.last_name}
                      onChange={(e) =>
                        setEditItem((prev: NewData) => ({
                          ...prev,
                          last_name: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center pb-4">
                    <label className="w-24 font-semibold">Email:</label>
                    <input
                      type="text"
                      className="border p-2"
                      placeholder="Email"
                      value={editItem?.email}
                      onChange={(e) =>
                        setEditItem((prev: NewData) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center pb-4">
                    <label className="w-24 font-semibold">Gender:</label>
                    <input
                      type="text"
                      className="border p-2"
                      placeholder="Gender"
                      value={editItem?.gender}
                      onChange={(e) =>
                        setEditItem((prev: NewData) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center pb-4">
                    <label className="w-24 font-semibold">IP ddress:</label>
                    <input
                      type="text"
                      className="border p-2"
                      placeholder="IP ddress"
                      value={editItem?.ip_address}
                      onChange={(e) =>
                        setEditItem((prev: NewData) => ({
                          ...prev,
                          ip_address: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div
                    className="mt-20 ml-32 text-xl text-center shadow-lg border w-20 bg-blue-300 cursor-pointer"
                    onClick={() => {
                      handleSaveEdit();
                      setEditData(false);
                    }}
                  >
                    <button>保存</button>
                  </div>
                </div>
              </PortalDraw>
            )}
          </div>
        </div>

        <div className="flex-1 bg-white overflow-auto">
          <table className="table-auto w-full  border border-gray-300 text-lg">
            <thead className=" font-bold border bg-[#eaf3fc] sticky top-0 z-10">
              <tr>
                <th className="text-left p-2"></th>

                <th className="text-left p-2"></th>

                <th className="text-left p-2">id</th>
                <th className="text-left p-2">first_name</th>
                <th className="text-left p-2">last_name</th>
                <th className="text-left p-2">email</th>
                <th className="text-left p-2">gender</th>
                <th className="text-left p-2">ip_address</th>
                <th></th>
              </tr>
            </thead>

            <tbody className="h-full bg-white">
              {clicklist.map((item, index) => (
                <tr
                  key={item.id}
                  className={`  border p-2  hover:bg-gray-300  duration-200
                    ${index % 2 === 0 ? "bg-white" : "bg-[rgb(247,248,253,1)]"}
                    ${
                      draggingIndex === index
                        ? "cursor-grabbing"
                        : "cursor-grab"
                    }
                    `}
                  draggable
                  onDragStart={() => {
                    handledragging(index);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={() => {
                    handleDragEnd();
                  }}
                >
                  <td
                    className="p-2 hover:bg-slate-400 rounded-full inline-block cursor-pointer"
                    onClick={(e) => {
                      setEditData(true);

                      // setIsCheckboxVisible(false);

                      setEditItem(item);

                      e.stopPropagation();
                    }}
                  >
                    <EditIcon />
                  </td>

                  {/* {isCheckboxVisible && ( */}
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={deleteId.includes(item.id)}
                      onChange={() => handleCheckDelete(item.id)}
                      className="scale-150 "
                    />
                  </td>
                  {/* )} */}
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.first_name}</td>
                  <td className="p-2">{item.last_name}</td>
                  <td className="p-2">{item.email}</td>
                  <td className="p-2">{item.gender}</td>
                  <td className="p-2">{item.ip_address}</td>
                  <td
                    className="hover:bg-red-500 rounded-full inline-block p-2 cursor-pointer"
                    onClick={() => {
                      // setSingleDeleteId(item.id);
                      handleSingleDelete(item.id);
                    }}
                  >
                    <ClearIcon />
                  </td>
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

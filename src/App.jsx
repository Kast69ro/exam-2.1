import React, { useEffect, useState } from "react";
import axios from "axios";
import userIcon from './assets/user-icon.png';
import oclock from './assets/Timer.png';
import lock from './assets/Lock.png';
import phoneIcon from './assets/tag.png';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const API = "https://67fcfcac3da09811b1743d99.mockapi.io/todolist";

const App = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadData();
    setInitialTheme();
  }, []);

  async function loadData() {
    try {
      const response = await axios.get(API);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  function setInitialTheme() {
    if (localStorage.theme === "dark" || !("theme" in localStorage)) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }

  function toggleTheme() {
    if (localStorage.theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      name: e.target["Name"].value,
      city: e.target["City"].value,
      email: e.target["Email"].value,
      phone: e.target["Phone"].value,
      status: e.target["Status"].checked,
      avatar: e.target["Avatar"].value,
    };
    try {
      await axios.post(API, newUser);
      loadData();
      e.target.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSave = async () => {
    if (!editId) return;
    const updatedUser = {
      name: editName,
      city: editCity,
    };
    try {
      await axios.put(`${API}/${editId}`, updatedUser);
      loadData();
      setEditId(null);
      setEditName("");
      setEditCity("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredData = data.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1900px] m-auto relative p-5">
      <Dialog>
        <DialogTrigger className="bg-blue-600 py-1.5 px-2 text-white font-bold rounded-[5px] w-[70px]">
          + NEW
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ADD USER</DialogTitle>
            <DialogDescription>
              <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
                <input
                  className="border-1 py-1.5 px-2 rounded-2xl"
                  name="Avatar"
                  type="text"
                  placeholder="Avatar URL"
                  required
                />
                <input
                  className="border-1 py-1.5 px-2 rounded-2xl"
                  name="Name"
                  type="text"
                  placeholder="Name"
                  required
                />
                <input
                  className="border-1 py-1.5 px-2 rounded-2xl"
                  name="Email"
                  type="email"
                  placeholder="Email"
                  required
                />
                <input
                  className="border-1 py-1.5 px-2 rounded-2xl"
                  name="City"
                  type="text"
                  placeholder="City"
                  required
                />
                <input
                  className="border-1 py-1.5 px-2 rounded-2xl"
                  name="Phone"
                  type="text"
                  placeholder="Phone"
                  required
                />
                <label className="flex items-center gap-2">
                  <input name="Status" type="checkbox" />
                  Active
                </label>
                <button
                  type="submit"
                  className="font-bold text-[20px] bg-blue-600 text-white py-2 rounded"
                >
                </button>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <input
        type="text"
        className="border-1 mx-5 py-1 px-2 md:w-[300px]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search User"
      />
      <button
        onClick={toggleTheme}
        className="bg-blue-600 py-1.5 px-2 text-white font-bold rounded-[5px] w-[95px] absolute right-[6px] md:right-[50px]"
      >
      </button>

      <Table className="w-full mt-10">
        <TableCaption>User list</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]  ">
              <img src={userIcon} alt="User" className="w-6 h-6" /> Name
            </TableHead>
            <TableHead className="  ">
              <img src={lock} alt="City" className="w-6 h-6" /> City
            </TableHead>
            <TableHead >
              <img src={oclock} alt="Status" className="w-6 h-6" /> Status
            </TableHead>
            <TableHead className="text-end flex items-center gap-2 justify-end">
              <img src={phoneIcon} alt="Phone" className="w-6 h-6" /> Phone
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredData.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium flex items-center gap-3">
                <img
                  className="w-[50px] h-[50px] rounded-full"
                  src={user.avatar}
                  alt={user.name}
                />
                <div>
                  {user.name}
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </TableCell>
              <TableCell>{user.city}</TableCell>
              <TableCell>
                {user.status ? (
                  <div className="w-[75px] bg-green-600 text-white py-1.5 px-2 rounded">
                    ACTIVE
                  </div>
                ) : (
                  <div className="w-[75px] bg-gray-600 text-white py-1.5 px-2 rounded">
                    INACTIVE
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right text-[20px]">{user.phone}</TableCell>
              <TableCell className="text-right text-[20px]">
                <Popover>
                  <PopoverTrigger className="cursor-pointer text-[24px]">...</PopoverTrigger>
                  <PopoverContent className="flex flex-col items-start gap-3 p-4">
                    <Sheet>
                      <SheetTrigger className="text-[17px] font-bold cursor-pointer">
                        View Profile
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>User Info</SheetTitle>
                          <SheetDescription className="text-center">
                            <hr />
                            <img
                              className="w-[200px] h-[200px] rounded-full m-auto mt-7"
                              src={user.avatar}
                              alt={user.name}
                            />
                            <h1 className="text-black text-3xl">{user.name}</h1>
                            <p className="text-[20px] my-2.5">{user.email}</p>
                            <p className="text-[20px] mb-2">{user.city}</p>
                            <p className="text-[20px] mb-2">{user.phone}</p>
                            <hr />
                          </SheetDescription>
                        </SheetHeader>
                      </SheetContent>
                    </Sheet>

                    <Dialog>
                      <DialogTrigger
                        asChild
                        onClick={() => {
                          setEditName(user.name);
                          setEditCity(user.city);
                          setEditId(user.id);
                        }}
                        className="text-[17px] font-bold cursor-pointer"
                      >
                      </DialogTrigger>
                   
                    </Dialog>

                    <Button
                      variant="outline"
                      className="bg-transparent border-none shadow-none text-red-600 text-[16px] cursor-pointer"
                      onClick={() => handleDelete(user.id)}
                    >
                    </Button>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default App;

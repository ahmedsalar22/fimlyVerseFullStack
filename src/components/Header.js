import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between p-3 text-3xl font-bold text-red-500 bg-gray-900 border-b-2 border-gray-500">
      {/* Logo */}
      <Link to={"/"}>
        <span className="px-2 py-1 text-white ">
          IMD<span className="text-red-500">b</span>
        </span>
      </Link>

      {/* Add New Button */}
      <Link to="/addmovie">
        <h1 className="flex items-center text-lg cursor-pointer">
          <Button
            variant="contained"
            color="secondary"
            className="transition-colors duration-300 hover:bg-red-600"
          >
            <AddIcon className="mr-1" />
            <span className="hidden md:inline">Add New</span>
          </Button>
        </h1>
      </Link>
    </div>
  );
};

export default Header;

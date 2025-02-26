import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search for anything"
        className="pl-10 bg-secondary rounded-full border-secondary"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    </div>
  );
};

export default SearchBar;

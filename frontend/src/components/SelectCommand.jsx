import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

export function SelectSimple({ options, value, onChange, placeholder = "Select an option..." }) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);
  
  // Ferme le dropdown quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  
  const handleSelect = (currentValue) => {
    onChange(currentValue === value ? "" : currentValue);
    setOpen(false);
    setSearchTerm("");
  };
  
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const selectedLabel = options.find(option => option.value === value)?.label;
  
  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button 
        type="button"
        onClick={() => setOpen(!open)} 
        className={`
          flex justify-between items-center w-full p-2 text-sm text-left cursor-pointer
          bg-white dark:bg-background border border-gray-200 dark:border-gray-700 rounded-md
          ${open ? "ring-1 ring-blue-500 border-blue-500" : ""}
          hover:border-gray-300 dark:hover:border-gray-600
        `}
      >
        <span className={value ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
          {value ? selectedLabel : placeholder}
        </span>
        <ChevronsUpDown size={16} className="opacity-50" />
      </button>
      
      {open && (
        <div className="
          absolute top-full mt-1 left-0 w-full z-10
          bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-md
          shadow-lg max-h-[300px] flex flex-col
        ">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full px-2 py-1.5 text-sm
                bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded
                focus:outline-none focus:ring-1 focus:ring-blue-500
                text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
              "
              autoFocus
            />
          </div>
          
          <div className="overflow-y-auto max-h-[250px]">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-center text-gray-500 dark:text-gray-400">
                No options found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`
                    flex justify-between items-center px-3 py-2 text-sm cursor-pointer
                    ${value === option.value 
                      ? "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"}
                  `}
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <Check size={16} className="text-blue-500" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectSimple;
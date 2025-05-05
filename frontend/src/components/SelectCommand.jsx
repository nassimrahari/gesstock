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
    <div className="select-container" ref={wrapperRef} style={styles.container}>
      <button 
        type="button"
        onClick={() => setOpen(!open)} 
        style={{
          ...styles.button,
          ...(open ? styles.buttonActive : {})
        }}
      >
        <span>{value ? selectedLabel : placeholder}</span>
        <ChevronsUpDown size={16} style={styles.chevron} />
      </button>
      
      {open && (
        <div style={styles.dropdown}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.input}
              autoFocus
            />
          </div>
          
          <div style={styles.optionsContainer}>
            {filteredOptions.length === 0 ? (
              <div style={styles.empty}>No options found.</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  style={{
                    ...styles.option,
                    ...(value === option.value ? styles.optionSelected : {})
                  }}
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <Check size={16} style={styles.checkIcon} />
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

// Styles inline pour éviter les dépendances CSS
const styles = {
  container: {
    position: 'relative',
    width: '100%',
  },
  button: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '8px 12px',
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  buttonActive: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 1px #3b82f6',
  },
  chevron: {
    opacity: 0.5,
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 5px)',
    left: 0,
    width: '100%',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    zIndex: 10,
    maxHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
  },
  searchContainer: {
    padding: '8px',
    borderBottom: '1px solid #e2e8f0',
  },
  input: {
    width: '100%',
    padding: '6px 8px',
    fontSize: '14px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    outline: 'none',
  },
  optionsContainer: {
    overflowY: 'auto',
    maxHeight: '250px',
  },
  option: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  optionSelected: {
    backgroundColor: '#f1f5f9',
  },
  empty: {
    padding: '12px',
    color: '#64748b',
    fontSize: '14px',
    textAlign: 'center',
  },
  checkIcon: {
    color: '#3b82f6',
  }
};

export default SelectSimple;
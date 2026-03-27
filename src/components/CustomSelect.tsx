import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}

const CustomSelect = ({ value, onChange, options, placeholder = "اختر...", className = "" }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const openDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
    setIsOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    const handleScroll = (event: Event) => {
      // ignore scrolls happening inside the dropdown list itself
      if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const dropdown = isOpen ? (
    <div style={dropdownStyle} dir="rtl" ref={dropdownRef}>
      <div role="listbox" className="bg-white border-2 border-gold/20 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="max-h-72 overflow-y-auto custom-scrollbar p-1">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(option.value);
                }}
                className={`
                  w-full px-5 py-3.5 text-right flex items-center justify-between
                  transition-all duration-200 rounded-xl mb-1 last:mb-0 group/item
                  ${isSelected
                    ? "bg-gradient-to-l from-gold via-gold to-gold-dark text-white font-bold shadow-lg"
                    : "text-foreground hover:bg-gold/5 hover:text-gold hover:shadow-sm active:scale-[0.98]"
                  }
                `}
              >
                <span className={`text-base transition-all ${isSelected ? "translate-x-1" : "group-hover/item:translate-x-1"}`}>
                  {option.label}
                </span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isSelected ? "bg-white/20" : "bg-transparent group-hover/item:bg-gold/10"}`}>
                  {isSelected && <Check className="w-5 h-5" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div ref={containerRef} className={`relative ${className}`} dir="rtl">
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => (isOpen ? setIsOpen(false) : openDropdown())}
        className={`
          w-full h-[54px] px-5 text-right bg-white border-2 rounded-xl
          focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none
          transition-all duration-200 flex items-center justify-between
          shadow-sm hover:shadow-md group
          ${isOpen ? "border-gold shadow-md ring-2 ring-gold/20" : "border-border hover:border-gold/50"}
        `}
      >
        <span className={`text-base transition-colors ${selectedOption ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-gold/10 rotate-180" : "bg-secondary group-hover:bg-gold/10"}`}>
          <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? "text-gold" : "text-muted-foreground group-hover:text-gold"}`} />
        </div>
      </button>

      {createPortal(dropdown, document.body)}
    </div>
  );
};

export default CustomSelect;

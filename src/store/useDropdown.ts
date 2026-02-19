import { useDropdownStore } from './dropdown.store';

export const useDropdown = (dropdownId: string) => {
  const isOpen = useDropdownStore((s) => s.isDropdownOpen(dropdownId));
  const openDropdown = useDropdownStore((s) => s.openDropdown);
  const closeDropdown = useDropdownStore((s) => s.closeDropdown);
  const closeAllDropdowns = useDropdownStore((s) => s.closeAllDropdowns);

  const handleToggle = () => {
    if (isOpen) {
      closeDropdown(dropdownId);
    } else {
      closeAllDropdowns();
      openDropdown(dropdownId);
    }
  };

  const handleSelect = (callback: () => void) => {
    callback();
    closeDropdown(dropdownId);
  };

  return {
    isOpen,
    handleToggle,
    handleSelect,
  };
};

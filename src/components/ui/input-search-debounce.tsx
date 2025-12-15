import { useDebouncedCallback } from "use-debounce";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { SearchIcon } from "lucide-react";

export const InputSearchDebounce = ({
  width = "w-full",
  placeholder,
  onChange,
}: {
  width: string;
  placeholder: string;
  onChange: (v: string) => void;
}) => {
  const debounced = useDebouncedCallback((value) => {
    onChange(value);
  }, 600);
  return (
    <InputGroup className={width}>
      <InputGroupInput
        placeholder={placeholder}
        onChange={(v) => debounced(v.target.value)}
      />
      <InputGroupAddon align="inline-end">
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
};

import { useCallback, useRef } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { TextInput } from 'react-native';

type InputRefs<T extends FieldValues> = {
  [key in Path<T>]?: TextInput;
};

const useFormNavigation = <T extends FieldValues>() => {
  const inputRefs = useRef<InputRefs<T>>({});

  const register = useCallback((id: Path<T>) => (ref: TextInput | null) => {
    if (ref) {
      inputRefs.current[id] = ref;
    }
  }, []);

  const toNext = useCallback((id: Path<T>) => () => {
    inputRefs.current[id]?.focus();
  }, []);

  return { register, toNext };
};

export default useFormNavigation;

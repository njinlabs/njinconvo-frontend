import { ReactNode, useState } from "react";

export type ModalControl<T = any> = {
  open: (args?: T | undefined) => void;
  close: () => void;
  isOpen: boolean;
};

type ModalHookOptions<T> = {
  initialState?: T;
  initialOpen?: boolean;
};

type ModalHookReturn<T> = {
  state: T;
  control: ModalControl<T>;
};

export type ModalParams = {
  children?: ReactNode;
  title: string;
  control: ModalControl;
  onClose?: () => void;
};

export const useModal = <T>({
  initialState,
  initialOpen = false,
}: ModalHookOptions<T>): ModalHookReturn<T> => {
  const [state, setState] = useState<T>(initialState as T);
  const [open, setOpen] = useState(initialOpen);

  return {
    state,
    control: {
      open: (state = initialState) => {
        setState(state as T);
        setOpen(true);
      },
      close: () => {
        setState(initialState as T);
        setOpen(false);
      },
      isOpen: open,
    },
  };
};

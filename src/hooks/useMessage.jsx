import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { createAsyncMessage } from '../slices/ToastSlice';

function useMessage() {
  const dispatch = useDispatch();
  const showSuccess = useCallback(
    (message) => {
      dispatch(
        createAsyncMessage({
          success: true,
          message,
        }),
      );
    },
    [dispatch],
  );

  const showError = useCallback(
    (message) => {
      dispatch(
        createAsyncMessage({
          success: false,
          message,
        }),
      );
    },
    [dispatch],
  );

  return {
    showError,
    showSuccess,
  };
}

export default useMessage;

import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const Modal = ({
  title,
  message,
  onClose,
  isSuccess = false,
}) => {
  const modalButton = isSuccess
    ? 'bg-green-800 text-white'
    : 'bg-red-800 text-white';
  const modalIcon = isSuccess ? (
    <CheckCircle2 color={'green'} size={70} />
  ) : (
    <XCircle color={'red'} size={70} />
  );

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-6'>
      <div className='absolute inset-0 bg-black opacity-50'></div>
      <div
        className='relative z-10  border border-blue-100 bg-white p-4 shadow-lg sm:p-6 lg:p-8'
        role='alert'
      >
        <div className='flex items-center justify-center'>{modalIcon}</div>
        <div className='mt-3 flex items-center justify-center gap-4'>
          <p className=' text-xl font-bold text-black'>{title}</p>
        </div>

        <div className='mt-3 flex items-center justify-center gap-4'>
          <p className=' mx-auto mb-4 max-w-md text-center text-gray-500'>
            {message}
          </p>
        </div>

        <div
          onClick={onClose}
          className={'mt-3 flex cursor-pointer items-center justify-center gap-4 bg-green-800 p-3 ' + modalButton}
          >
          <p>Close </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;

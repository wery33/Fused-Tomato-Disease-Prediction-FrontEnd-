import { Hourglass } from 'lucide-react';
import React from 'react';

const Loader = () => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black opacity-50'></div>
      <div
        className='relative z-10  border border-blue-100 bg-white p-4 shadow-lg sm:p-6 lg:p-8'
        role='alert'
      >
        <div className='flex items-center justify-center'>
          <Hourglass color={'gray'} size={70} />
        </div>
        <div className='mt-3 flex items-center justify-center gap-4'>
          <p className=' mx-auto mb-4 max-w-md text-center text-gray-500'>
            Processing. Please Wait...
          </p>
        </div>

        <div className='mt-3 flex items-center justify-center gap-4'>
          <div
            className=' text-brandPrimary dark:text-brandSecondary inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-current border-t-transparent text-darkGreen'
            role='status'
            aria-label='loading'
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
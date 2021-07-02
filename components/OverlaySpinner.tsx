import React, { Fragment } from 'react'
import { Transition } from '@headlessui/react'

type Props = {
  show: boolean
}

export default function OverlaySpinner ({ show }: Props) {
  return (
    <>
      <Transition
        show={show}
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-white bg-opacity-95">
          <svg className="spinner text-blue-400" viewBox="0 0 50 50">
            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
          </svg>
        </div>
      </Transition>
    </>
  )
}

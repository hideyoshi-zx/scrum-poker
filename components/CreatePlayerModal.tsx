import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { IdentificationIcon } from '@heroicons/react/outline'
import Button from '../components/elements/Button'

type Props = {
  open: boolean
  onSubmit: (name: string) => any
}

export default function CreatePlayerModal({ open, onSubmit }: Props) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
    setSubmitting(true)
    event.preventDefault();
    await onSubmit(name)
    setSubmitting(false)
  }

  return (
    <Transition.Root show={open} as={Fragment} beforeLeave={() => setLeaving(true)} afterLeave={() => setLeaving(false)}>
      <Dialog as="div" static className="fixed z-10 inset-0 overflow-y-auto" open={open} onClose={() => {}}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <IdentificationIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                    Please type your display name
                  </Dialog.Title>
                </div>
              </div>
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="mt-5">
                    <input
                      type="text"
                      value={name}
                      onChange={handleChange}
                      name="name"
                      placeholder="Your display name"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mt-5">
                    <div className="rounded-md shadow">
                      <Button variant="primary" disabled={!name} loading={submitting || leaving} className="w-full">
                        {submitting ? 'Joining' : 'Continue to game' }
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

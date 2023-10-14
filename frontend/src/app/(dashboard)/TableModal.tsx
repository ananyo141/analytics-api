import React from "react";
import { Button } from "@tremor/react";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import syntaxHighlight from "@/utils/syntaxHighlight";

type Props = {
  className?: string;
  data: any;
  title?: string;
  description?: string;
};

const TableModal = ({
  className,
  title = "Details",
  description,
  data,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  return (
    <div onClick={openModal} className={className}>
      <div className="flex justify-center rounded-b-lg">
        <Button size="xs" onClick={openModal} variant="secondary" color="gray">
          See details
        </Button>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0">
            <div className="flex min-h-fit items-center h-full justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform min-h-fit ring-tremor bg-white p-6 text-left align-middle shadow-tremor transition-all rounded-xl">
                  {title !== undefined && (
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                  )}
                  {description !== undefined && (
                    <div className="mt-2">
                      <p className="text-sm pb-2 text-gray-500">
                        {description}
                      </p>
                    </div>
                  )}
                  <hr />
                  <pre
                    dangerouslySetInnerHTML={{ __html: syntaxHighlight(data) }}
                    className="relative text-base block h-3/4 max-h-[75vh] mt-3 overflow-auto"
                  />
                  <Button
                    className="mt-5 w-full bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
                    onClick={closeModal}
                  >
                    Go back
                  </Button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default TableModal;

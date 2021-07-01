import React from 'react'

type Props = {
  moving: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<any>
}

export default function HeroSection({ moving, onClick } : Props) {
  return (
    <div className="h-screen relative overflow-hidden">
      <div className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full" aria-hidden="true">
        <div className="relative h-full w-full">
          <svg
            className="absolute right-full bottom-0 transform translate-y-1/4 translate-x-1/4 lg:translate-x-1/2"
            width={404}
            height={784}
            fill="none"
            viewBox="0 0 404 784"
          >
            <defs>
              <pattern
                id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width={404} height={784} fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
          </svg>
          <svg
            className="absolute left-full top-0 transform -translate-y-1/4 -translate-x-1/4 lg:-translate-x-1/2"
            width={404}
            height={784}
            fill="none"
            viewBox="0 0 404 784"
          >
            <defs>
              <pattern
                id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width={404} height={784} fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)" />
          </svg>
        </div>
      </div>

      <div className="relative h-full flex items-center justify-center">
        <main className="max-w-7xl px-4">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Let's play</span>{' '}
              <span className="block text-blue-600 xl:inline">Scrum Poker</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Simple poker pointing app for scrum teams.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Button loading={moving} onClick={onClick} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

type ButtonProps = {
  loading: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<any>
}

function Button ({ loading, onClick } : ButtonProps) {
  if (loading) {
    return (
    <div className="rounded-md shadow">
      <button
        onClick={onClick}
        type="button"
        disabled
        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 md:py-4 md:text-lg md:px-10 cursor-not-allowed bg-opacity-50"
      >
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Preparing
      </button>
    </div>
    )
  } else {
    return (
      <div className="rounded-md shadow">
        <button
          onClick={onClick}
          type="button"
          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
        >
          Start new game
        </button>
      </div>
    )
  }
}

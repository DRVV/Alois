import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Chat Overlay Component
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          A React component that provides a chat overlay with auto-disappearing messages.
          Messages slide up and fade in/out with smooth animations.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/demo"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            View Demo
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Features:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Auto-disappearing messages</li>
              <li>Slide up + fade animations</li>
              <li>Top-right positioning</li>
              <li>Customizable duration</li>
              <li>Multiple message stacking</li>
              <li>Responsive design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

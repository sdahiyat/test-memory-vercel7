import { Camera, Target, TrendingUp, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">NutriTrack</h1>
            </div>
            <div className="flex space-x-4">
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Sign In
              </button>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              AI-Powered
              <span className="text-primary-600"> Nutrition Tracking</span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
              Simplify your nutrition journey with intelligent meal logging, 
              AI photo recognition, and personalized insights to help you reach your health goals.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg text-lg font-medium">
                Start Tracking Free
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium">
                Learn More
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Photo Logging</h3>
              <p className="text-gray-600">
                Simply take a photo of your meal and let AI identify foods and estimate nutrition automatically.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Insights</h3>
              <p className="text-gray-600">
                Get personalized nutrition feedback and suggestions based on your eating patterns and goals.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick & Easy</h3>
              <p className="text-gray-600">
                Reduce friction with recent foods, smart suggestions, and lightning-fast meal logging.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-white rounded-2xl p-8 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to transform your nutrition tracking?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of users who have simplified their health journey with NutriTrack.
            </p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg text-lg font-medium">
              Get Started Today
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 NutriTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

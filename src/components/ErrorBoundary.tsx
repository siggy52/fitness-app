import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-red-600 mb-4">页面加载出错</h2>
            <div className="bg-red-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-mono text-red-700 break-all">
                {this.state.error.message}
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              请把上面的错误信息告诉我，我来修复。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-all"
            >
              重新加载
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

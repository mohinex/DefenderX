import React, { Component, ErrorInfo, ReactNode } from "react";
import { ShieldX, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught exception captured by SecOps Error Boundary:", error, errorInfo);
  }

  private handleReboot = () => {
    localStorage.removeItem("eurosia_token");
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050816] text-[#ffffff] font-mono flex items-center justify-center p-6 select-none relative overflow-hidden">
          {/* Neon digital grid visual layout effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(10,16,37,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(10,16,37,0.7)_1px,transparent_1px)] bg-[size:40px_40px] opacity-15 pointer-events-none" />
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-red-alert/10 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(255, 123, 115, 0.04)" }} />

          <div className="w-full max-w-lg border border-red-alert/30 bg-[#0a1025]/95 p-8 rounded-xl shadow-2xl relative z-10 select-none">
            <div className="flex items-center gap-4 border-b border-red-alert/20 pb-4 mb-6">
              <div className="p-3 bg-red-alert/20 rounded-lg text-[#ff7b73]">
                <ShieldX size={34} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-widest uppercase text-[#ff7b73]">
                  TRANSCEIVER SHIELD BREACH
                </h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                  CORE GRAPHICAL INTERFACE TERMINATED
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#050816] border border-red-alert/10 p-4 rounded-lg text-red-alert font-mono text-[11px] leading-relaxed max-h-32 overflow-y-auto">
                <span className="text-gray-500">[EXC-LOG]:</span> {this.state.error?.stack || this.state.error?.message || "NullPointerException: Direct channel structure corrupt."}
              </div>

              <p className="text-gray-400 text-[11px] leading-relaxed">
                The Security Operations platform captured a rendering buffer override. Local cache pipelines may hold corrupt session hashes. Rebooting the transceiver tunnel will cycle local parameters safely.
              </p>

              <button
                onClick={this.handleReboot}
                className="w-full py-3 bg-red-alert text-[#ffffff] font-bold text-[11px] tracking-widest rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-80 transition-all duration-200 cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>FORCE SYSTEM REBOOT</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

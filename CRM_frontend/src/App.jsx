import { TooltipProvider } from "@/components/ui/tooltip";
import DashBoard from "./pages/Dashboard";

function App() {
  return (

    <TooltipProvider>
      <DashBoard />
    </TooltipProvider>

  );
}

export default App;

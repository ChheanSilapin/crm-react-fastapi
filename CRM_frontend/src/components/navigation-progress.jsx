import { useEffect, useRef } from "react";
import LoadingBar from "react-top-loading-bar";
import { useIsFetching } from "@tanstack/react-query";

export function NavigationProgress() {
  const ref = useRef(null);
  
  // This automatically listens to React Query and returns > 0 if ANY api is loading
  const isFetching = useIsFetching();

  useEffect(() => {
    if (isFetching > 0) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }
  }, [isFetching]);

  return (
    <LoadingBar
      color="var(--muted-foreground)"
      ref={ref}
      shadow={true}
      height={2}
    />
  );
}

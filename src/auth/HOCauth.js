import { CircularProgress, Stack } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function WithAuth(Component) {
  const ComponentWithAuth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      axios
        .get("/api/login-session")
        .then((result) => {
          if (router.pathname == "/") return router.push("/dashboard");
          if (result.data.isVerify) setIsLoading(false);
        })
        .catch((error) => {
          router.push("/");
          setIsLoading(false);
        });
    }, [router.isReady]);

    return isLoading ? (
      <Stack
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "80vh",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Stack>
    ) : (
      <Component />
    );
  };

  ComponentWithAuth.getLayout = Component.getLayout;

  return ComponentWithAuth;
}

export default WithAuth;

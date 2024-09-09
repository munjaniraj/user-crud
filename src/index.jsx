// ** React Imports
import { useState } from "react";
import Logo from "public/images/logos/SiteLog.svg";

// ** Next Imports
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

// ** MUI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import MuiFormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import { CircularProgress, FormHelperText } from "@mui/material";

// ** Icons Imports
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";

// ** Configs

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrationsV1 from "src/views/pages/auth/FooterIllustration";
import AlertMessage from "src/components/Alert/AlertMessage";
import axios from "axios";
import WithAuth from "src/auth/HOCauth";

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));

const LinkStyled = styled("a")(({ theme }) => ({
  fontSize: "0.875rem",
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  "& .MuiFormControlLabel-label": {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  },
}));

const LoginPage = () => {
  const router = useRouter();
  // ** State
  const [inLogin, setInLogin] = useState(false);
  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });
  const [userData, setuserData] = useState({
    showPassword: false,
  });

  const validationSchema = yup.object({
    email: yup
      .string("Please Input Email")
      .matches(
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        "Please enter valid email address"
      )
      .required("Email is required"),
    password: yup
      .string("Please enter your password")
      .min(3, "Password should be of minimum 8 characters length")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setInLogin(true);

      if (values.email && values.password) {
        try {
          axios
            .post("/api/login", values, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              if (response.status === 200) {
                setAlertpop({
                  open: true,
                  message: response.data.message,
                });
                setTimeout(() => {
                  setInLogin(false);
                  router.push("/dashboard");
                }, 2000);
              }
            })
            .catch((error) => {
              setAlertpop({
                open: true,
                message: error.response.data.message,
                color: "error",
              });
              setInLogin(false);
            });
        } catch (error) {
          alert(error);
          setInLogin(false);
        }
      }
    },
  });

  return (
    <Box className="content-center">
      <Card sx={{ zIndex: 1 }}>
        <CardContent
          sx={{ padding: (theme) => `${theme.spacing(12, 9, 7)} !important` }}
        >
          <Box
            sx={{
              mb: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={Logo.src} width={140} height={60} />
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, marginBottom: 1.5 }}
            >
              Welcome to Empiric infotech! 👋🏻
            </Typography>
            <Typography variant="body2">
              Please sign-in to your account and start the adventure
            </Typography>
          </Box>
          <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  fullWidth
                  name="email"
                  type="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  placeholder="carterleonard@gmail.com"
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="auth-login-password">
                    password
                  </InputLabel>
                  <OutlinedInput
                    label="Password"
                    value={formik.values.password}
                    id="auth-login-password"
                    name="password"
                    onChange={formik.handleChange}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    type={userData.showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            setuserData({
                              ...userData,
                              showPassword: !userData.showPassword,
                            })
                          }
                          aria-label="toggle password visibility"
                        >
                          {userData.showPassword ? (
                            <EyeOutline />
                          ) : (
                            <EyeOffOutline />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {formik.touched.password && formik.errors.password ? (
                  <FormHelperText
                    sx={{ color: "#FF4C51", marginLeft: "14px !important" }}
                  >
                    {formik.touched.password && formik.errors.password}
                  </FormHelperText>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  size="large"
                  variant="contained"
                  sx={{ marginBottom: 7, marginTop: 10 }}
                  disabled={inLogin ? true : false}
                >
                  {inLogin ? <CircularProgress /> : "Login"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
      <AlertMessage setAlertpop={setAlertpop} Alertpop={Alertpop} />
    </Box>
  );
};
LoginPage.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default WithAuth(LoginPage);

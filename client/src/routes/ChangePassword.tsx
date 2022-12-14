import { Box, Button, CircularProgress, Container, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showResponse } from "../App";
import { Logo } from "../components/Logo";
import { PageNotFoundContent } from "./PageNotFound";

export function ChangePassword() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const token = useParams().token;

    const [componentToRender, setComponentToRender] = React.useState(<CircularProgress />);

    React.useEffect(() => {
        fetch(`/api/reset/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            showResponse(response, enqueueSnackbar, closeSnackbar);
            if (response.status === 200) {
                setComponentToRender(<NewPassword />);
            } else if (response.status === 401) {
                setComponentToRender(<ResendEmail />);
            } else {
                setComponentToRender(<PageNotFoundContent />);
            }
        });
    }, []);

    return <FormContainer>{componentToRender}</FormContainer>;
}

function NewPassword() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [submitted, setSubmitted] = React.useState(false);
    const [responded, setResponded] = React.useState(false);

    const token = useParams().token;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);

        const data = new FormData(event.currentTarget);
        const json = {
            password: data.get("password"),
        };

        fetch(`/api/reset/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        }).then((response) => {
            const success = response.status === 200;
            setSubmitted(success);
            setResponded(success);
            if (success) navigate("/login");
            showResponse(response, enqueueSnackbar, closeSnackbar);
        });
    };

    return (
        <>
            <Typography component="h1" variant="h5">
                Reset password
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
                <TextField
                    disabled={submitted}
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="New password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    autoFocus
                />
                <Button disabled={submitted} fullWidth sx={{ mt: 3, mb: 2 }} type="submit" variant="contained">
                    {submitted && !responded ? <CircularProgress size={24.5} /> : "Change password"}
                </Button>
            </Box>
        </>
    );
}

function ResendEmail() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const token = useParams().token;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const json = {
            token: token,
        };
        fetch("/api/reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        }).then((response) => {
            showResponse(response, enqueueSnackbar, closeSnackbar);
        });
    };

    return (
        <>
            <Typography component="h1" variant="h5">
                Reset password
            </Typography>
            <Typography sx={{ mt: 2 }}>The token has expired. Please request a new one.</Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Resend email
                </Button>
            </Box>
        </>
    );
}

function FormContainer({ children }: { children?: React.ReactNode }) {
    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Logo />

                {children}
            </Box>
        </Container>
    );
}

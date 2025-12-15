"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Email,
  Lock,
  Notifications,
  Security,
  Delete,
} from "@mui/icons-material";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const router = useRouter();
  const [deleteSnackOpen, setDeleteSnackOpen] = useState(false);
  const [deleteSnackMsg, setDeleteSnackMsg] = useState("");
  const [deleteSnackSeverity, setDeleteSnackSeverity] = useState("success");

  const handleChangePassword = () => {
    console.log("Password changed");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await fetch("/api/delete-account", { method: "POST" });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Delete account failed:", json);
        setDeleteSnackSeverity("error");
        setDeleteSnackMsg(`Delete failed: ${json.error || "Unknown error"}`);
        setDeleteSnackOpen(true);
        return;
      }
      setDeleteSnackSeverity("success");
      setDeleteSnackMsg("Account deleted successfully");
      setDeleteSnackOpen(true);

      localStorage.clear();
      sessionStorage.clear();

      await signOut({ callbackUrl: "/" });
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error(e);
      setDeleteSnackSeverity("error");
      setDeleteSnackMsg("Delete failed due to network/server error.");
      setDeleteSnackOpen(true);
    }
  };

  return (
    <>
      <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: "bold",
          }}
        >
          Settings
        </Typography>

        {/* Account Settings */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Email sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Account Settings
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              defaultValue="john.doe@example.com"
              sx={{ mb: 2 }}
            />
            <Button variant="outlined" sx={{ mb: 3 }}>
              Change Email
            </Button>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Lock sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Password
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Current Password"
              type="password"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              sx={{ mb: 2 }}
            />
            <Button variant="outlined" onClick={handleChangePassword}>
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Notifications sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Notifications
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
              }
              label="Email Notifications"
              sx={{ mb: 1, display: "block" }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: 4, mb: 2, display: "block" }}
            >
              Receive workout reminders and progress updates via email
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                />
              }
              label="Push Notifications"
              sx={{ mb: 1, display: "block" }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: 4, mb: 2, display: "block" }}
            >
              Get notified about new workouts and achievements
            </Typography>
          </CardContent>
        </Card>

        {/* Security */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Security sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Security
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={twoFactor}
                  onChange={(e) => setTwoFactor(e.target.checked)}
                />
              }
              label="Two-Factor Authentication"
              sx={{ mb: 1, display: "block" }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: 4, mb: 2, display: "block" }}
            >
              Add an extra layer of security to your account
            </Typography>

            <Button variant="outlined" sx={{ mt: 1 }}>
              View Login History
            </Button>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Security sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Privacy & Data
              </Typography>
            </Box>

            <Button variant="outlined" sx={{ mb: 2, mr: 2 }}>
              Download My Data
            </Button>
            <Button variant="outlined" sx={{ mb: 2 }}>
              Export Workout History
            </Button>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Request a copy of your personal data and workout history
            </Typography>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card
          sx={{
            mb: 3,
            borderColor: "error.main",
            borderWidth: 1,
            borderStyle: "solid",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Delete sx={{ mr: 1, color: "error.main" }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "error.main" }}
              >
                Account Management
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 2 }}>
              Once you delete your account, there is no going back. All your
              data will be permanently removed.
            </Typography>

            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={deleteSnackOpen}
        autoHideDuration={2000}
        onClose={() => setDeleteSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setDeleteSnackOpen(false)}
          severity={deleteSnackSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {deleteSnackMsg}
        </Alert>
      </Snackbar>
      <Footer />
    </>
  );
}
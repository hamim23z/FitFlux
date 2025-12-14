"use client";
import { useSession, signOut } from "next-auth/react";
import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleMenuClose();
    signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  useEffect(() => {
    if (isAuthenticated && pathname === "/") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, pathname, router]);

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", cursor: "pointer" }}
          >
            FitFlux
          </Typography>
        </Link>

        <Stack direction="row" spacing={2} alignItems="center">
          {isAuthenticated ? (
            <>
              <Button component={Link} href="/dashboard" color="inherit">
                Dashboard
              </Button>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar
                  alt={session?.user?.name || "User"}
                  src={session?.user?.image || undefined}
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem
                  component={Link}
                  href="/profile"
                  onClick={handleMenuClose}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  component={Link}
                  href="/user-settings"
                  onClick={handleMenuClose}
                >
                  Settings
                </MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button component={Link} href="/about-us" color="inherit">
                About Us
              </Button>
              <Button component={Link} href="/contact" color="inherit">
                Contact
              </Button>
              <Button component={Link} href="/sign-in" color="inherit">
                Sign In
              </Button>
              <Button
                component={Link}
                href="/sign-up"
                color="inherit"
                variant="outlined"
                sx={{ borderColor: "white" }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
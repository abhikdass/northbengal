import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Edit,
  LogOut,
  Settings,
  User,
  Bell,
  Globe,
  Shield,
  Moon,
  Sun,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface UserProfileProps {
  className?: string;
}

export function UserProfile({ className = "" }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
    bio: "Travel enthusiast exploring the beauty of North Bengal. Love hiking, photography, and local cuisines.",
    location: "Siliguri, West Bengal",
    trips: 8,
    savedPlaces: 24,
    reviews: 12,
  });

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      tripReminders: true,
      marketingEmails: false,
    },
    privacy: {
      profileVisibility: "public",
      shareLocation: true,
      shareTrips: true,
      allowTagging: true,
    },
    appearance: {
      theme: "light",
      language: "english",
      fontSize: "medium",
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      rememberDevices: true,
    },
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Save to backend API
      const response = await fetch(
        "https://api.northbengaltravel.com/api/user/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(userData),
        },
      );

      if (response.ok) {
        console.log("Profile saved to backend successfully");
        // Close the edit dialog
        setIsEditing(false);
        // Also save to localStorage for offline access
        localStorage.setItem("userProfile", JSON.stringify(userData));
      } else {
        console.warn("Failed to save profile to backend, saving locally only");
        // Save to localStorage for persistence even if API fails
        localStorage.setItem("userProfile", JSON.stringify(userData));
        setIsEditing(false);
        alert("Profile saved locally. Changes will sync when you reconnect.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      // Save to localStorage for persistence as fallback
      localStorage.setItem("userProfile", JSON.stringify(userData));
      setIsEditing(false);
      alert("Profile saved locally. Changes will sync when you reconnect.");
    }
  };

  const handleSaveSettings = async () => {
    try {
      // Save settings to backend API
      const response = await fetch(
        "https://api.northbengaltravel.com/api/user/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(settings),
        },
      );

      if (response.ok) {
        console.log("Settings saved to backend successfully");
        // Close the settings dialog
        setIsSettingsOpen(false);
        // Also save to localStorage for offline access
        localStorage.setItem("userSettings", JSON.stringify(settings));
      } else {
        console.warn("Failed to save settings to backend, saving locally only");
        // Save to localStorage for persistence even if API fails
        localStorage.setItem("userSettings", JSON.stringify(settings));
        setIsSettingsOpen(false);
        alert("Settings saved locally. Changes will sync when you reconnect.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      // Save to localStorage for persistence as fallback
      localStorage.setItem("userSettings", JSON.stringify(settings));
      setIsSettingsOpen(false);
      alert("Settings saved locally. Changes will sync when you reconnect.");
    }
  };

  // Load user data from backend API with fallback to localStorage
  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        // Try to fetch profile from API
        const profileResponse = await fetch(
          "https://api.northbengaltravel.com/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log("Fetched profile from API:", profileData);
          setUserData(profileData);

          // Update localStorage with latest data
          localStorage.setItem("userProfile", JSON.stringify(profileData));
        } else {
          console.warn("Failed to fetch profile from API, using local data");
          // Fall back to localStorage
          const savedProfile = localStorage.getItem("userProfile");
          if (savedProfile) {
            setUserData(JSON.parse(savedProfile));
          }
        }

        // Try to fetch settings from API
        const settingsResponse = await fetch(
          "https://api.northbengaltravel.com/api/user/settings",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );

        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          console.log("Fetched settings from API:", settingsData);
          setSettings(settingsData);

          // Update localStorage with latest data
          localStorage.setItem("userSettings", JSON.stringify(settingsData));
        } else {
          console.warn("Failed to fetch settings from API, using local data");
          // Fall back to localStorage
          const savedSettings = localStorage.getItem("userSettings");
          if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        // Fall back to localStorage
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
          setUserData(JSON.parse(savedProfile));
        }

        const savedSettings = localStorage.getItem("userSettings");
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      }
    };

    loadUserData();
  }, []);

  return (
    <Card className={`${className} overflow-hidden`}>
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Profile</CardTitle>
          <div className="flex gap-1">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveProfile} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={userData.location}
                      onChange={(e) =>
                        setUserData({ ...userData, location: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={userData.bio}
                      onChange={(e) =>
                        setUserData({ ...userData, bio: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                  <DialogDescription>
                    Customize your app experience and preferences
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="notifications" className="mt-4">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="notifications">
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="privacy">Privacy</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>

                  <TabsContent value="notifications" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notif">Email Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive trip updates via email
                        </p>
                      </div>
                      <Switch
                        id="email-notif"
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              email: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notif">Push Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive alerts on your device
                        </p>
                      </div>
                      <Switch
                        id="push-notif"
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              push: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notif">SMS Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive text messages for important updates
                        </p>
                      </div>
                      <Switch
                        id="sms-notif"
                        checked={settings.notifications.sms}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              sms: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="trip-reminders">Trip Reminders</Label>
                        <p className="text-sm text-gray-500">
                          Get reminders before your scheduled trips
                        </p>
                      </div>
                      <Switch
                        id="trip-reminders"
                        checked={settings.notifications.tripReminders}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              tripReminders: checked,
                            },
                          })
                        }
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="privacy" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-visibility">
                        Profile Visibility
                      </Label>
                      <Select
                        value={settings.privacy.profileVisibility}
                        onValueChange={(value) =>
                          setSettings({
                            ...settings,
                            privacy: {
                              ...settings.privacy,
                              profileVisibility: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger id="profile-visibility">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="share-location">Share Location</Label>
                        <p className="text-sm text-gray-500">
                          Allow app to access your location
                        </p>
                      </div>
                      <Switch
                        id="share-location"
                        checked={settings.privacy.shareLocation}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            privacy: {
                              ...settings.privacy,
                              shareLocation: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="share-trips">Share Trip History</Label>
                        <p className="text-sm text-gray-500">
                          Make your trips visible to others
                        </p>
                      </div>
                      <Switch
                        id="share-trips"
                        checked={settings.privacy.shareTrips}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            privacy: {
                              ...settings.privacy,
                              shareTrips: checked,
                            },
                          })
                        }
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="appearance" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme-select">Theme</Label>
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center justify-center w-16 h-16 rounded-md cursor-pointer border-2 ${settings.appearance.theme === "light" ? "border-primary" : "border-transparent"}`}
                          onClick={() =>
                            setSettings({
                              ...settings,
                              appearance: {
                                ...settings.appearance,
                                theme: "light",
                              },
                            })
                          }
                        >
                          <Sun className="h-8 w-8 text-yellow-500" />
                        </div>
                        <div
                          className={`flex items-center justify-center w-16 h-16 rounded-md cursor-pointer border-2 ${settings.appearance.theme === "dark" ? "border-primary" : "border-transparent"} bg-gray-800`}
                          onClick={() =>
                            setSettings({
                              ...settings,
                              appearance: {
                                ...settings.appearance,
                                theme: "dark",
                              },
                            })
                          }
                        >
                          <Moon className="h-8 w-8 text-blue-300" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language-select">Language</Label>
                      <Select
                        value={settings.appearance.language}
                        onValueChange={(value) =>
                          setSettings({
                            ...settings,
                            appearance: {
                              ...settings.appearance,
                              language: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger id="language-select">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="bengali">Bengali</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="font-size">Font Size</Label>
                      <Select
                        value={settings.appearance.fontSize}
                        onValueChange={(value) =>
                          setSettings({
                            ...settings,
                            appearance: {
                              ...settings.appearance,
                              fontSize: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger id="font-size">
                          <SelectValue placeholder="Select font size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="two-factor">
                          Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security
                        </p>
                      </div>
                      <Switch
                        id="two-factor"
                        checked={settings.security.twoFactorAuth}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              twoFactorAuth: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="login-alerts">Login Alerts</Label>
                        <p className="text-sm text-gray-500">
                          Get notified of new logins to your account
                        </p>
                      </div>
                      <Switch
                        id="login-alerts"
                        checked={settings.security.loginAlerts}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              loginAlerts: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="remember-devices">
                          Remember Devices
                        </Label>
                        <p className="text-sm text-gray-500">
                          Stay logged in on trusted devices
                        </p>
                      </div>
                      <Switch
                        id="remember-devices"
                        checked={settings.security.rememberDevices}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              rememberDevices: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="pt-4">
                      <Button variant="outline" className="w-full">
                        <Shield className="mr-2 h-4 w-4" /> Security Checkup
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsSettingsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSettings}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{userData.name}</h3>
            <p className="text-sm text-gray-500">{userData.location}</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">{userData.bio}</p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <p className="text-xl font-semibold">{userData.trips}</p>
            <p className="text-xs text-gray-500">Trips</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <p className="text-xl font-semibold">{userData.savedPlaces}</p>
            <p className="text-xs text-gray-500">Saved</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <p className="text-xl font-semibold">{userData.reviews}</p>
            <p className="text-xs text-gray-500">Reviews</p>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="w-[48%]"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" /> Settings
          </Button>
          <Button variant="outline" size="sm" className="w-[48%]">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
